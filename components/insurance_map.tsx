import vnTopo from '../geo_data/vn_map.json';
import hsa from '../geo_data/hoang_sa.json';
import truongsa from '../geo_data/truong_xa.json';
import serviceCenter from '../geo_data/service_center.json';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from 'react-simple-maps';
import DrawerInfoCenter from "./drawer_info_center";
import {useEffect, useRef, useState} from "react";
import find from 'lodash/find';
import useWindowSize from "../hooks/useWindowSize";
import CityInfoCard from "./city_info_card";

const vietnam = [vnTopo, hsa, truongsa];

export default function InsuranceMap({selected, setSelected}: any) {
  const ref = useRef<any>(null);
  const [visibleInfo, setVisibleInfo] = useState(false);
  const [selectedVal, setSelectedVal] = useState<any>(null);
  const markers = serviceCenter.map((center) => ({
    markerOffset: 0,
    ...center,
    coordinates: [center.position[1], center.position[0]],
  }));
  const {width} = useWindowSize();

  const handleCity = (e: any, idx: any, city: any) => {
    e.stopPropagation();
    setSelected(idx);
  }

  useEffect(() => {
    if (selected) {
      setSelectedVal(find(serviceCenter, (obj) => obj.index === selected))
      setVisibleInfo(true);
    }
  }, [selected])

  useEffect(() => {
    if (ref.current) {
      ref.current?.scrollTo(230, 0);
    }
  }, [ref.current]);

  return (
    <div className="relative overflow-auto lg:overflow-hidden w-full flex justify-center" ref={ref}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 2800,
          center: [105, 15] // coordinate of VietNam [long, lat]
        }}
        style={{
          width: width && (width < 980) ? 800 : 1000,
          height: width && (width < 980) ? 1000 : 1300,
          backgroundColor: '#fff'
        }}
        onClick={() => {
          setSelected(null)
          setVisibleInfo(false)
        }}
      >
        {/*<ZoomableGroup center={[104, 17]}>*/}
        {vietnam.map((geoUrl) => (
          <Geographies geography={geoUrl}>
            {({geographies}) => {
              return geographies.map((geo, idx) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  onClick={(e) => handleCity(e, idx, null)}
                  style={{
                    default: {
                      fill: idx === selected ? '#e6dfd9' : '#EAEAEC',
                      stroke: idx === selected ? '#212529' : '#bbbbc3',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                    hover: {
                      fill: '#e6dfd9',
                      stroke: '#212529',
                      strokeWidth: 0.75,
                      outline: 'none',
                    },
                  }}
                />
              ));
            }}
          </Geographies>
        ))}
        {markers.map((
          {
            name,
            coordinates,
            markerOffset,
            important = false,
            phone,
            address,
            labelPosition,
            labelPositionMb,
            positionRect = false,
            showLabel = true,
          }: any) => {
          const pos = width && (width < 980) ? labelPositionMb ? labelPositionMb : labelPosition : labelPosition;
          return (
            <Marker key={name} coordinates={coordinates}>
              <g
                fill="none"
                stroke="#FF5533"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                transform="translate(-12, -24)"
              >
                <circle cx="7.2" cy="6" r="2" strokeWidth="1.5"/>
                <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" style={{
                  transform: "scale(0.6)"
                }}/>
              </g>
              {showLabel && <text
                textAnchor="middle"
                y={markerOffset}
                style={{fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 6}}
              >
                {name}
              </text>}
              {
                important && (
                  <g
                    fill="none"
                    stroke="#FF5533"
                    strokeWidth="2"
                    // strokeLinecap="round"
                    // strokeLinejoin="round"
                    // transform="translate(-12, -24)"
                    className="cursor-pointer hover:stroke-[#F00]"
                  >
                    <line x1={pos[0]} y1={pos[1]} x2={pos[2]} y2={pos[3]}
                          style={{stroke: "#FF5533", strokeWidth: 2}}/>
                    <rect
                      x={pos[2] > 0 ? pos[2] : pos[2] - 150}
                      y={positionRect ? pos[3] - 88 : pos[3]}
                      width="150" height="88"
                      style={{fill: "#FF553350", strokeWidth: 2, stroke: "#FF5533"}}
                      rx="5" ry="5"
                    />
                    <foreignObject
                      textAnchor="middle"
                      x={pos[2] > 0 ? pos[2] + 5 : pos[2] - 145}
                      y={positionRect ? pos[3] - 88 + 5 : pos[3] + 5}
                      width="140" height="14"
                      strokeWidth={1.3}
                      style={{fontFamily: "system-ui", stroke: "#434343", fontSize: 10}}
                      className="tracking-[.2em]"
                    >
                      {/*@ts-ignore*/}
                      <p xmlns="http://www.w3.org/1999/xhtml" className="font-bold">{name}</p>
                    </foreignObject>

                    <a
                      href={`https://maps.google.com/?q=${address}`}
                      className="hover:underline"
                      target={'_blank'}
                    >
                      <foreignObject
                        // textAnchor="middle"
                        x={pos[2] > 0 ? pos[2] + 5 : pos[2] - 145}
                        y={positionRect ? pos[3] - 88 + 19 : pos[3] + 19}
                        strokeWidth="1"
                        width="140" height="70"
                        style={{fontFamily: "system-ui", stroke: "#434343", fontSize: 8, strokeWidth: 1,}}
                        className="hover:underline cursor-pointer"
                      >
                        {/*@ts-ignore*/}
                        <p xmlns="http://www.w3.org/1999/xhtml">{address}</p>
                      </foreignObject>
                    </a>

                    <a href={`tel:${phone}`} className="hover:underline stroke-1">
                      <foreignObject
                        textAnchor="middle"
                        x={pos[2] > 0 ? pos[2] + 5 : pos[2] - 145}
                        y={positionRect ? pos[3] - 21 : pos[3] + 80 - 13}
                        width="140" height="14"
                        strokeWidth="1"
                        style={{fontFamily: "system-ui", stroke: "#434343"}}
                        className="tracking-wide"
                      >
                        {/*@ts-ignore*/}
                        <p xmlns="http://www.w3.org/1999/xhtml" className="font-bold text-[9px]">{phone}</p>
                      </foreignObject>
                    </a>
                  </g>
                )
              }
            </Marker>
          )
        })}
        <Marker key={'hoang_sa'} coordinates={[112.211510, 16.516926]}>
          <text
            textAnchor="middle"
            y={0}
            style={{fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 8}}
          >
            Hoang Sa
          </text>
        </Marker>
        <Marker key={'truong_sa'} coordinates={[112.643751, 11.205404]}>
          <text
            textAnchor="middle"
            y={0}
            style={{fontFamily: "system-ui", fill: "#5D5A6D", fontSize: 8}}
          >
            Truong Sa
          </text>
        </Marker>
        {/*</ZoomableGroup>*/}
      </ComposableMap>
      <DrawerInfoCenter
        visible={visibleInfo}
        setVisible={setVisibleInfo}
        data={selectedVal}
      />
    </div>
  )
}
