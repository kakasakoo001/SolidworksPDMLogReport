import PropTypes from 'prop-types';
import axios from 'axios';
// @mui
import { styled } from '@mui/material/styles';
import {
  Toolbar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import USERS from '../../../_mock/users';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// ----------------------------------------------------------------------

UserListToolbarDefault.propTypes = {
  numSelected: PropTypes.number,
  onSearchType: PropTypes.func,
  onSearchDate: PropTypes.func,
  onSearchUser: PropTypes.func,
  onLogDatas: PropTypes.func,  
};

export default function UserListToolbarDefault({ numSelected, onSearchType, onSearchDate, onSearchUser, onLogDatas }) {  
  const today = dayjs();
  const dateString = today.format("YYYY-MM"); // 오늘 날짜(년-월) 리턴

  const [searchType, setSearchType] = useState('month');
  const [searchDate, setSearchDate] = useState(dateString);
  const [searchUser, setSearchUser] = useState('All');

  // server 에서 resopnse 데이터 가져오기
  const callLogData =  async (searchType, searchDate, searchUser) => {
    const url = `/logs/download?search_type=${searchType}&search_date=${searchDate}&user_id=${searchUser}`;
    const res = await axios.get(url);
    
    onSearchType(searchType);
    onSearchDate(searchDate);
    onSearchUser(searchUser);
    
    onLogDatas(res.data);
  };

  // type별 형식에 맞는 날짜 리턴
  function getSearchDate(searchType, year, month, day) {
    return (
      searchType === "day" ? `${year}-${month}-${day}` 
       : searchType === "month" ? `${year}-${month}` 
       : `${year}`
    )
  };
  
  // type 변경 시 type별 형식에 맞는 날짜 리턴
  const getSearchDateForChangeType = (searchType, searchDate) => {
    const date = dayjs(searchDate);
    return (         
      searchType === "day" ? `${date.format("YYYY-MM-DD")}` 
       : searchType === "month" ? `${date.format("YYYY-MM")}` 
       : `${date.format("YYYY")}`
    )
  };

  // 초기 화면 셋팅
  useEffect(() => {
    callLogData(searchType, searchDate, searchUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearchType = async (event) => {
    
    const type = event.target.value;

    const date = getSearchDateForChangeType(type, searchDate);

    setSearchType(type);

    console.log("searchType==>", type);     
    console.log("searchDate==>", date);     
    console.log("searchUser==>", searchUser);           

    callLogData(type, date, searchUser);
    
  };

  const handleSearchDate = async (newValue) => {  
         
    const date = getSearchDateForChangeType(searchType, newValue.$d);

    setSearchDate(date);

    console.log("handleSearchDate searchType==>", searchType);     
    console.log("handleSearchDate searchDate==>", date);     
    console.log("handleSearchDate searchUser==>", searchUser); 
    
    callLogData(searchType, date, searchUser);
  };
  
  const nameChange = (event) => {

    console.log("event.target.value", event.target.value);
    const {
      target: { value },
    } = event;
    setSearchUser(value);
  };

  return (
    <StyledRoot sx={{...(numSelected > 0 && {color: 'primary.main', bgcolor: 'primary.lighter',}),}}>
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        <div>
          <FormControl sx={{ m: 2, minWidth: 120, ml: 'auto' }}>
            <InputLabel id="demo-simple-select-standard-label">검색 구분</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={searchType}
              onChange={handleSearchType}
              label="dateOption"
              defaultValue="month"
              selected={searchType}
            >
              <MenuItem value="month">월</MenuItem>
              <MenuItem value="year">연</MenuItem>
            </Select>
          </FormControl>
        </div>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            sx={{ width: 180, m: 2 }}
            label="검색 날짜"
            openTo={searchType === 'month' ? 'month' : 'year'}
            views={searchType === 'month' ? ['month', 'year'] : ['year']}
            minDate={dayjs('2015-01-01')}
            maxDate={dayjs()}
            format={searchType === 'month' ? 'YYYY/MM' : 'YYYY'}
            defaultValue={dayjs()}            
            onAccept={(newValue) => handleSearchDate(newValue)}            
          />
        </LocalizationProvider>
        <div>
          <FormControl sx={{ m: 2, width: 300 }}>
            <Select
              id="searchUser"
              single
              value={searchUser}
              onChange={nameChange}
              MenuProps={MenuProps}
              defaultValue="All"
            >
              {USERS.map((value) => (
                <MenuItem key={value.userid} value={value.username}>
                  {value.username}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
    </StyledRoot>
  );
}