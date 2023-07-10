import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// sections
import DownloadLogChartPage from './DownloadLogChartPage';
import DownloadLogTablePage from './DownloadLogTablePage';

export default function NewCreateLogPage() {  
  const [searchType, setSearchType] = useState('');  // 검색 구분
  const [searchDate, setSearchDate] = useState('');       // 검색 날짜
  const [searchUser, setSearchUser] = useState('');       // 검색 사용자
  const [logDatas, setLogDatas] = useState([]);           // server 처리 결과
  const [tableHead, setTabelHead] = useState([]);           // server 처리 결과
  // const [param, setParam] = useState([]);           // server 처리 결과

  // const params = useParams();
  // console.log(params.id);

  // useEffect(() => {
  //   setParam(params.id);
  // }, [params.id]);

  return (
    <>
      <Helmet>
        <title>신규등록 로그</title>
      </Helmet>
    
      <DownloadLogChartPage 
        title={`신규등록 로그`}
        subTitle={`${searchType==='month'?'월':'연'}, ${searchDate}, ${searchUser}`}
        xLabel={`${searchType==='month'?'일':'월'}`}
        chartDatas={logDatas} 
        chartLabels={tableHead} 
      />
      <br />
      <DownloadLogTablePage 
        sParam={'newcreate'}
        onSearchType={setSearchType}
        onSearchDate={setSearchDate}
        onSearchUser={setSearchUser}
        onLogDatas={setLogDatas}
        onTableHead={setTabelHead}
      /> 
    </>
  );
}