import {useEffect, useMemo, useState} from "react";


export default function DrawerInfoCenter(
  {
    visible,
    setVisible,
    data,
  }
    : {
    visible: boolean,
    setVisible: Function,
    data: any
  }
) {

  const getMap = useMemo(() => {
    return data?.address && <div className="gmap_canvas">
      <iframe className="gmap_iframe" width="100%" frameBorder="0" scrolling="no" marginHeight={0} marginWidth={0}
              src={`https://maps.google.com/?q=${data.address}&output=embed`}/>
    </div>
  }, [data?.address])

  return (
    <div
      className={`top-0 lg:right-0 hidden lg:flex lg:absolute z-2 transform ease-in-out duration-300
      flex-col
      ${
        visible ? "translate-x-0" : "translate-x-full"
      }
      `}
    >
      <div
        className={`w-[312px] h-[312px] bg-red-100  p-[6px] 
      text-white 
       rounded-lg
       border-2
       border-red-400
      `}
      >
        <div>
          <div className="mapouter">
            {getMap}
          </div>
        </div>
      </div>
      <div className="rounded-lg border-2 border-red-400 p-[6px] mt-1 w-[312px]">
        <div className="text-sm text-blue-500 cursor-pointer hover:underline">{data?.address}</div>
        <a href={`tel:${data?.phone}`}>
          <div className="font-semibold">{data?.phone}</div>
          <div className="text-gray-400 text-sm">Nhấn để gọi đến tổng đài</div>
        </a>
      </div>
    </div>
  )
}