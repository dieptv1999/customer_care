import TextField from "@mui/material/TextField";
import TreeSelect from "mui-tree-select/dist/TreeSelect";
import serviceCenter from '../geo_data/service_center.json';
import reduce from 'lodash/reduce';
import has from 'lodash/has';
import React, {useState} from "react";
import {FreeSoloNode} from "mui-tree-select";
import {styled} from "@mui/material/styles";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Paper from "@mui/material/Paper";
import ToggleButton from "@mui/material/ToggleButton";
import ViewList from "@mui/icons-material/ViewList";
import MyLocationIcon from '@mui/icons-material/MyLocation';
import find from 'lodash/find'
import useWindowSize from "../hooks/useWindowSize";
import CityInfoCard from "./city_info_card";

const data = reduce(serviceCenter, (result: any, acc: any): any => {
  if (!has(result, acc.area)) {
    result[acc.area] = {}
    result[acc.area]['regions'] = {};
  }

  if (!has(result[acc.area]['regions'], acc.region)) result[acc.area]['regions'][acc.region] = [];

  result[acc.area]['regions'][acc.region].unshift({...acc, id: `${acc.region}|${acc.name}`})

  return result;

}, {})

const rootNodes = reduce(data, (result, value, key): any => {
  return [...result, {
    id: key,
    name: key,
    emoji: "VN",
    regions: reduce(value.regions, (res, val, key2): any => {
      return [...res, {
        id: key2,
        name: key2,
        "cities": val,
      }]
    }, [])
  }]
}, [])

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({theme}) => ({
  '& .MuiToggleButtonGroup-grouped': {
    margin: theme.spacing(0.5),
    border: 0,
    '&.Mui-disabled': {
      border: 0,
    },
    '&:not(:first-of-type)': {
      borderRadius: theme.shape.borderRadius,
    },
    '&:first-of-type': {
      borderRadius: theme.shape.borderRadius,
    },
  },
}));

class Node {
  value: any;

  constructor(value: any) {
    this.value = value;
  }

  getParent() {
    const parent = (() => {
      if ("regions" in this.value) {
        return null;
      } else if ("cities" in this.value) {
        return (
          rootNodes.find(({regions}: any) =>
            regions.some(({id}: any) => id === this.value.id)
          ) || null
        );
      } else {
        for (const node of rootNodes) {
          // @ts-ignore
          const regions = node.regions.find(({cities}: any) =>
            cities.some(({id}: any) => id === this.value.id)
          );
          if (regions) {
            return regions;
          }
        }
        return null;
      }
    })();
    return parent ? new Node(parent) : parent;
  }

  getChildren() {
    if ("regions" in this.value) {
      return this.value.regions.map((region: any) => new Node(region));
    } else if ("cities" in this.value) {
      return this.value.cities.map((city: any) => new Node(city));
    } else {
      return null;
    }
  }

  isBranch() {
    return "regions" in this.value || "cities" in this.value;
  }

  isEqual(to: any) {
    return to.value.id === this.value.id;
  }

  toString() {
    return this.value.name;
  }
}

const syncOrAsync = function (value: any, returnAsync: any) {
  if (returnAsync) {
    return new Promise((resolve) =>
      setTimeout(() => resolve(value), Math.random() * 500)
    );
  }
  return value;
};

export default function FilterInsurance(
  {
    view,
    setView,
    selected,
    setSelected
  }: any) {
  const {width} = useWindowSize();
  const [runAsync, setRynAsync] = useState(false);

  const renderInput = (params: any) => (
    <TextField
      {...params}
      label="City"
      helperText="Chọn thành phố nơi bạn bảo hành."
    />
  )

  const handleView = (
    event: React.MouseEvent<HTMLElement>,
    newView: string,
  ) => {
    setView(newView);
  };
  const selectedVal = find(serviceCenter, o => o.index === selected)

  return (
    <>
      <div className="flex justify-between w-full h-[80px]">
        {view === 'map' ? <TreeSelect
          className={`${width && (width < 980) ? 'w-full mr-6' : 'w-[400px]'}`}
          size={width && (width < 980) ? 'small' : 'medium'}
          value={selectedVal ? new Node(selectedVal) : null}
          onChange={(event, value) => {
            setSelected(value?.value?.index)
          }}
          getChildren={(node: Node | null) =>
            syncOrAsync(
              node
                ? node.getChildren()
                : rootNodes.map((country) => new Node(country)),
              runAsync
            )
          }
          getOptionDisabled={(option) => {
            var _a;
            return (
              option.isBranch() &&
              !((_a = option.getChildren()) === null || _a === void 0
                ? void 0
                : _a.length)
            );
          }}
          getParent={(node) => syncOrAsync(node.getParent(), runAsync)}
          isBranch={(node) => syncOrAsync(node.isBranch(), runAsync)}
          isOptionEqualToValue={(option, value) => {
            return option instanceof FreeSoloNode ? false : option.isEqual(value);
          }}
          renderInput={renderInput}
        /> : <div/>}
        <div>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              flexWrap: 'wrap',
            }}
          >
            <StyledToggleButtonGroup
              size="small"
              value={view}
              exclusive
              onChange={handleView}
              aria-label="text alignment"
            >
              <ToggleButton value="map" aria-label="centered">
                <MyLocationIcon/>
              </ToggleButton>
              <ToggleButton value="table" aria-label="left aligned">
                <ViewList/>
              </ToggleButton>
            </StyledToggleButtonGroup>
          </Paper>
        </div>
      </div>
      {width && (width < 980) && <CityInfoCard data={selectedVal}/>}
    </>
  )
}