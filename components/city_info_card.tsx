export default function CityInfoCard({data}: any) {
  return (
    <div className={`${data ? '' : 'hidden'} rounded-lg border w-full p-2 transform ease-in-out duration-300 `}>
      {/*<div className="font-bold text-md">{data?.name}</div>*/}
      <a
        className="text-sm mb-2 text-[#0d6efd]"
        href={`https://maps.google.com/?q=${data?.address}&output=embed`} target={'_blank'}>
        <div>{data?.address}</div>
      </a>
      <a href={`tel:${data?.phone}`}>
        <div className="font-semibold">{data?.phone}</div>
        <div className="text-gray-400 text-sm">Nhấn để gọi đến tổng đài</div>
      </a>
    </div>
  )
}