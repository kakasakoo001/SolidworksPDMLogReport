import PropTypes from 'prop-types';
// @mui
import { styled, alpha } from '@mui/material/styles';
import {
  Toolbar,
  OutlinedInput,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Box,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import axios from 'axios';
// import data
import LOGLIST from '../../../_mock/logdata';

// ----------------------------------------------------------------------

const StyledRoot = styled(Toolbar)(({ theme }) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}));

const StyledSearch = styled(OutlinedInput)(({ theme }) => ({
  width: 240,
  transition: theme.transitions.create(['box-shadow', 'width'], {
    easing: theme.transitions.easing.easeInOut,
    duration: theme.transitions.duration.shorter,
  }),
  '&.Mui-focused': {
    width: 320,
    boxShadow: theme.customShadows.z8,
  },
  '& fieldset': {
    borderWidth: `1px !important`,
    borderColor: `${alpha(theme.palette.grey[500], 0.32)} !important`,
  },
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
  autoFocus: false,
};

// ----------------------------------------------------------------------

UserListToolbarLoginLog.propTypes = {
  // numSelected: PropTypes.number,
  pageType: PropTypes.string,
  onSearchOption: PropTypes.func,
  onDateOption: PropTypes.func,
  onLicenseOption: PropTypes.func,
};

export default function UserListToolbarLoginLog({
  // numSelected,
  pageType,
  onSearchOption,
  onDateOption, // 선택한 날짜 넘겨주는 function
  onLicenseOption,
  onLogDatas,
}) {
  // console.log('무한루프툴바', pageType);
  const today = dayjs();
  const todayString = today.format('YYYY-MM-DD'); // 오늘 날짜(년-월) 리턴
  const [selectedOption, setSelectedSearch] = useState('day'); // 날짜 검색 옵션
  const [selectedDate, setSelectedDate] = useState(todayString); // 검색할 날짜
  const [licenseList, setLicenseList] = useState([]); // 선택 날짜에서의 License List 목록
  const [licenseName, setLicenseName] = useState([]); // License List의 license 이름들만
  const [selectedLicense, setSelectedLicense] = useState('All'); // select에 보여질 license 이름

  // server에서 License List 가져오기
  const callLicenseList = async (searchType, searchDate) => {
    const url = `/logs/licenselist?search_type=${searchType}&search_date=${searchDate}`;
    const res = await axios.get(url);
    console.log('license list url', url);

    if (res.data.length === 0) {
      // 보유 라이선스 없음
      setLicenseList([]);
      setLicenseName([]);
      setSelectedLicense('');
      console.log('empty');
    } else {
      setLicenseList(res.data);
      setLicenseName(['All', ...res.data.map((license) => license.lic_id)]);
      console.log(selectedLicense, 'selectedlicense');
      if (selectedLicense.length === 0) {
        console.log('if절');
        setSelectedLicense('All');
      }
      console.log(selectedLicense, '확인용');
    }
  };

  // server 에서 response 데이터 가져오기
  const callLogData = async (pageType, searchType, searchDate, selectedLicense) => {
    // const res = [];
    if (pageType === 'license') {
      const url = `/logs/loginlicense?search_type=${searchType}&search_date=${searchDate}&lic_id=${selectedLicense}`;
      console.log('log data url_license', url);
      const res = await axios.get(url);
      onLogDatas(res.data);
    } else {
      const url = `/logs/loginuser?search_type=${searchType}&search_date=${searchDate}&lic_id=${selectedLicense}`;
      const res = await axios.get(url);
      onLogDatas(res.data);
      console.log('log data url_user', url);
    }

    onSearchOption(searchType);
    onDateOption(searchDate);
    onLicenseOption(selectedLicense);
  };

  // type별 형식에 맞는 날짜 리턴
  function getSearchDate(searchType, year, month, day) {
    return searchType === 'day' ? `${year}-${month}-${day}` : searchType === 'month' ? `${year}-${month}` : `${year}`;
  }

  // type 변경 시 type별 형식에 맞는 날짜 리턴
  const getSearchDateForChangeType = (searchType, searchDate) => {
    const date = dayjs(searchDate);
    return searchType === 'day'
      ? `${date.format('YYYY-MM-DD')}`
      : searchType === 'month'
      ? `${date.format('YYYY-MM')}`
      : `${date.format('YYYY')}`;
  };

  // 초기 값 주기
  useEffect(() => {
    callLicenseList(selectedOption, selectedDate);
    callLogData(pageType, selectedOption, selectedDate, selectedLicense);
  }, []);

  // 날짜 검색 옵션 바꿀 시
  const optionChange = async (e) => {
    e.preventDefault();
    try {
      const type = e.target.value;
      setSelectedSearch(type);
      // setSearchOption(type);

      const searchDate = getSearchDateForChangeType(type, selectedDate);
      console.log('searchDate', searchDate, selectedDate);

      callLicenseList(type, searchDate);
      callLogData(pageType, type, searchDate, selectedLicense);

      // const loadLicenseList = () => {callLicenseList(type, searchDate)}
      // // callLogData(pageType, type, searchDate, selectedLicense);
      // useEffect()

      console.log(
        'option change selectedOption: ',
        e.target.value,
        'selectedDate: ',
        searchDate,
        'licenseName: ',
        licenseName,
        'selectedLicense',
        selectedLicense
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 검색할 날짜를 바꿀 시
  const dateChange = async (value) => {
    // e.preventDefault();
    try {
      const searchDate = getSearchDateForChangeType(selectedOption, value.$d);
      setSelectedDate(() => searchDate); // selectedDate를 설정해줌
      // setDateOption(searchDate); // selectedDate를 받는 function -> Report에서 호출할 것

      // callLicenseList(selectedOption, searchDate).then(
      //   callLogData(pageType, selectedOption, searchDate, selectedLicense)
      // );

      await callLicenseList(selectedOption, searchDate);
      console.log('여기');
      console.log(selectedLicense, '확인용2');
      await callLogData(pageType, selectedOption, searchDate, selectedLicense);

      console.log(
        'date change selectedOption: ',
        selectedOption,
        'selectedDate: ',
        searchDate,
        'licenselist',
        licenseList,
        'licenses: ',
        licenseName,
        'selectedLicense',
        selectedLicense
      );
    } catch (err) {
      console.log(err);
    }
  };

  // 검색할 라이선스를 바꿀 시
  const licenseChange = async (e) => {
    e.preventDefault();
    try {
      const license = e.target.value;
      setSelectedLicense(license);
      console.log('license::::', license);

      const searchDate = getSearchDateForChangeType(selectedOption, selectedDate);

      callLogData(pageType, selectedOption, searchDate, license);

      console.log(
        'license change selectedOption: ',
        e.target.value,
        'selectedDate: ',
        selectedDate,
        'licenseName: ',
        licenseName,
        'selectedLicense',
        selectedLicense
      );
    } catch (err) {
      console.log(err);
    }

    // MULTIPLE SELECT일 시
    // setLicenseName(
    //   // On autofill we get a stringified value.
    //   typeof value === 'string' ? value.split(',') : value
    // );
  };

  console.log('왜이려', licenseList, licenseName, selectedLicense);
  // console.log('pagetype', pageType);

  // MULTIPLE SELECT일 때 쓰는 함수들
  // const checkAll = (checked) => {
  //   if (checked) {
  //     setLicenseName(licenseName);
  //     // handleChange();
  //     // console.log('yes checked: ', licenseName);
  //     // console.log('yes length:', licenseName.filter((license) => license !== 'all').length);
  //   } else {
  //     setLicenseName([]);
  //     // handleChange();
  //     // console.log('no checked: ', licenseName);
  //     // console.log('no length:', licenseName.filter((license) => license !== 'all').length);
  //   }
  //   // onFilterLicense(licenseName);
  // };

  // const checkSingle = (checked, value) => {
  //   if (checked) {
  //     setLicenseName((prev) => [...prev, value]);
  //     // handleChange();
  //     // console.log(inputs);
  //   } else {
  //     setLicenseName(licenseName.filter((el) => el !== value));
  //     // handleChange();
  //     // console.log(inputs);
  //   }
  // };

  const checkSingle = (event) => {
    setSelectedLicense(event.target.value);
  };

  // console.log('toolbar: ', res);

  return (
    <StyledRoot
    // sx={{
    //   ...(numSelected > 0 && {
    //     color: 'primary.main',
    //     bgcolor: 'primary.lighter',
    //   }),
    // }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'left' }}>
        {/* 날짜 검색 옵션 */}
        <div>
          <FormControl sx={{ m: 2.5, minWidth: 120, ml: 'auto' }}>
            <InputLabel id="demo-simple-select-standard-label">검색 구분</InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={selectedOption}
              onChange={optionChange}
              label="dateOption"
              defaultValue={selectedOption}
              name="search_type"
            >
              <MenuItem value="day">일</MenuItem>
              <MenuItem value="month">월</MenuItem>
              <MenuItem value="year">연</MenuItem>
            </Select>
          </FormControl>
        </div>
        {/* 달력 */}
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ko">
          <DatePicker
            sx={{ width: 180, m: 2.5 }}
            label="검색 날짜"
            openTo={selectedOption === 'year' ? 'year' : selectedOption === 'month' ? 'month' : 'day'}
            views={
              selectedOption === 'year'
                ? ['year']
                : selectedOption === 'month'
                ? ['year', 'month']
                : ['year', 'month', 'day']
            }
            minDate={dayjs('2015-01-01')}
            maxDate={dayjs()}
            // defaultValue={dayjs()}
            format={selectedOption === 'year' ? 'YYYY' : selectedOption === 'month' ? 'YYYY-MM' : 'YYYY-MM-DD'}
            value={
              // selectedOption === 'year'
              //   ? selectedDate.slice(0, 3)
              //   : selectedOption === 'month'
              //   ? selectedDate.slice(0, 6)
              //   : selectedDate
              dayjs(selectedDate)
            }
            onAccept={dateChange}
          />
        </LocalizationProvider>
        {/* 라이선스 선택 */}
        <div>
          <FormControl sx={{ m: 2.5, width: 300 }}>
            <InputLabel id="demo-multiple-checkbox-label">라이선스</InputLabel>
            <Select
              sx={{ height: 56 }}
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              // multiple
              // value={licenseName.filter((license) => license !== 'all')}
              value={selectedLicense}
              onChange={licenseChange}
              input={<OutlinedInput label="라이선스" />}
              // renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
            >
              {/* <MenuItem key="all" value="all" onClick={(event) => checkAll(event.target.checked)}>
                <Checkbox
                  checked={licenseName.filter((license) => license !== 'all').length === selected.length}
                  value="모두 선택"
                  onChange={(event) => checkAll(event.target.checked)}
                />
                <ListItemText primary="모두 선택" />
              </MenuItem> */}
              {licenseName.map((license) => (
                <MenuItem key={license} value={license} onClick={checkSingle}>
                  {/* <Checkbox checked={license.includes(license)} value={license} /> */}
                  <ListItemText primary={license} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      </Box>
      {/* <Box sx={{ m: 3 }}>
        단위 : {selectedOption === 'year' ? '월' : selectedOption === 'month' ? '일' : '시'}
        <br />
      </Box> */}
    </StyledRoot>
  );
}