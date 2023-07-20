import PropTypes from 'prop-types';
import { useState } from 'react';
import axios from 'axios';
// @mui
import {
  Button,
  Link,  
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Typography,  
} from '@mui/material';
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
// components
// sections
import { LogListHead } from '../sections/@dashboard/log';

// ----------------------------------------------------------------------
const DEATIL_HEAD = [
  { id: 'datetime', label: '로그일자', alignRight: false },
  { id: 'filename', label: '파일명', alignRight: false },
  { id: 'version', label: '버전', alignRight: false },
  { id: 'filesize', label: '파일사이즈', alignRight: false },
];

// ----------------------------------------------------------------------

PDMDetailLogPage.propTypes = {
  data: PropTypes.string,
  sParam: PropTypes.string,  
  searchType: PropTypes.string,
  searchDate: PropTypes.string,
  searchUser: PropTypes.string,
};

export default function PDMDetailLogPage({ data, sParam, searchType, searchDate, searchUser }) {
  const [isLoading, setIsLoading] = useState(true); // loding
  const [open, setOpen] = useState(false); // dialog open
  const [detailLogData, setDetailLogData] = useState([]); // detail log data

  const callLogData = async (sParam, searchType, searchDate, searchUser) => {
    const url = `/logs/${sParam}/detail`;
    const data = {
        'search_type' : searchType,
        'search_date' : searchDate,
        'user_id' : searchUser,
    };
    const config = {"Content-Type": 'application/json'};

    await axios.post(url, data, config)
        .then(res => {
            // success
            setDetailLogData(res.data);
            setIsLoading(false);
        }).catch(err => {
            // error
            console.log(err.response.data.message); // server error message
        });    
  };

  const handleClickOpen = () => () => {
    setOpen(true);
    callLogData(sParam, searchType, searchDate, searchUser);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (    
    <>
      <Link component="button" onClick={handleClickOpen()}>{data.logdata}</Link>

      <Dialog
        open={open}
        onClose={handleClose}
        scroll="paper"
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        maxWidth="lg"
      >
        <DialogTitle id="scroll-dialog-title">상세 로그 리스트</DialogTitle>        
        <DialogContent dividers="true">          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="left" colSpan={2} sx={{ padding: 1, backgroundColor: 'white' }}>                         
                    <Typography variant="subtitle1" noWrap>{data.logusername}, {detailLogData.length} 건</Typography>                                      
                  </TableCell>
                  <TableCell align="right" colSpan={2} sx={{ padding: 1, backgroundColor: 'white' }}>                         
                    <Button>EXPORT</Button>                                      
                  </TableCell>
                </TableRow>
                <TableRow>
                  {DEATIL_HEAD.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.alignRight ? 'right' : 'left'}
                    >
                        <Typography variant="subtitle2" noWrap>{headCell.label}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? "Loding..." : detailLogData.map((row, idx) => {
                  const { datetime, filename, version, filesize } = row;

                  return (
                    <TableRow hover key={idx} tabIndex={-1}>
                      <TableCell align="left">{datetime}</TableCell>
                      <TableCell align="left">{filename}</TableCell>
                      <TableCell align="left">{version}</TableCell>
                      <TableCell align="left">{filesize}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>닫기</Button>          
        </DialogActions>
      </Dialog>    
    </>
  );
}