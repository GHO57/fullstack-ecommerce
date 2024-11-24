import React, { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Tooltip, Paper, Fab, Button, IconButton, Modal, Box, FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, TextField, InputAdornment, Stack, Chip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import OutlinedInput from '@mui/material/OutlinedInput';
import SearchIcon from '@mui/icons-material/Search';
import { Loader } from '../../../layouts';
import 'react-toastify/dist/ReactToastify.css';
import { adminGetAllAdmins, deleteAdmin, updateAdminRole } from '../../../features/admin/adminThunks';
import AddNewAdmin from '../AddNewAdmin/AddNewAdmin';
import { roles } from '../data'
import { categories } from '../../seller/data'
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 350,
    height: 170,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '3px',
}

const ITEM_HEIGHT = 48; 
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            borderRadius: 7,
            marginLeft: '5rem'
        },
    },
    MenuListProps: {
        style: {
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '2px'
        },
    },
};


const ManageAdmins = () => {

    const dispatch = useDispatch()

    const { adminLoading, adminMessage, adminError, allUsers, allAdmins, allSellers, isAuthenticated } = useSelector((state) => state.admin)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const [adminId, setAdminId] = useState('')
    const [adminEmail, setAdminEmail] = useState('')
    const [adminRole, setAdminRole] = useState('')
    const [deleteConfirmation, setDeleteConfirmation] = useState(false)
    const [updateConfirmation, setUpdateConfirmation] = useState(false)
    const [popup, setPopup] = useState(false)

    const [sortValue, setSortValue] = useState('')
    const [roleName, setRoleName] = useState([])
    const [searchAdmin, setSearchAdmin] = useState('')
    const [selectedAdmins, setSelectedAdmins] = useState([])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const table_head_cell_properties = { color: 'white', fontWeight: "bold", fontFamily: "Montserrat, sans-serif"  }
    const table_body_cell_properties = { fontFamily: "Montserrat, sans-serif", fontWeight: 500, fontSize: 13, border: '1px solid #ddd' }
    const truncation_properties = {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };

    const handleDeleteModalOpen = (admin_id) => {
        setAdminId(admin_id)
        setDeleteConfirmation(true)
    }

    const handleDeleteModalClose = () => {
        setAdminId('')
        setDeleteConfirmation(false)
    }

    const handleAdminDelete = () => {
        setDeleteConfirmation(false)
        dispatch(deleteAdmin(adminId))
        setPage(0)
    }

    const handleUpdateModalOpen = (admin_email, admin_role) => {
        setAdminEmail(admin_email)
        setAdminRole(admin_role)
        setUpdateConfirmation(true)
    }

    const handleUpdateModalClose = () => {
        setAdminEmail('')
        setAdminRole('')
        setUpdateConfirmation(false)
    }

    const handleAdminUpdate = () => {
        setUpdateConfirmation(false)
        const roleUpdateForm = new FormData
        if(adminEmail && adminRole){
            roleUpdateForm.set("email", adminEmail)
            roleUpdateForm.set("role", adminRole)
        }
        dispatch(updateAdminRole(roleUpdateForm))
        setPage(0)
    }

    const handleAddNewAdminOpen = () => {
        setPopup(true)
    }

    const handleSortValueChange = (e) => {
        setSortValue(e.target.value)
    }

    const handleRoleNameChange = (event) => {
        setRoleName(event.target.value);
    }

    const handleSearchAdmin = (event) => {
        setSearchAdmin(event.target.value)
    }

    const handleAdminCheckboxSelect = (id) => {
        const selectedIndex = selectedAdmins.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selectedAdmins, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selectedAdmins.slice(1));
        } else if (selectedIndex === selectedAdmins.length - 1) {
            newSelected = newSelected.concat(selectedAdmins.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selectedAdmins.slice(0, selectedIndex),
                selectedAdmins.slice(selectedIndex + 1),
            );
        }

        setSelectedAdmins(newSelected);
    };

    const handleAllAdminSelect = (event) => {
        if(event.target.checked){
            const newSelected = allAdmins.map(admin => admin.id)
            setSelectedAdmins(newSelected)
        }else(
            setSelectedAdmins([])
        )
    }

    useEffect(() => {
        if(allAdmins.length === 0){
            dispatch(adminGetAllAdmins())
        }
        setPage(0)
    }, [dispatch, roleName, sortValue, searchAdmin])

    const sortAdmins = (admins, sortValue) => {
        switch (sortValue) {
            case 'Name-A2Z':
                return [...admins].sort((a, b) => a.fullname.localeCompare(b.fullname));
            case 'Name-Z2A':
                return [...admins].sort((a, b) => b.fullname.localeCompare(a.fullname));
            case 'Email-A2Z':
                return [...admins].sort((a, b) => a.email.localeCompare(b.email));
            case 'Email-Z2A':
                return [...admins].sort((a, b) => b.email.localeCompare(a.email));
            case 'Old-New':
                return [...admins].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
            case 'New-Old':
                return [...admins].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
            default:
                return admins;
        }
    };

    const filterAdmins = (admins, roles, searchTerm) => {
    
        if (!Array.isArray(admins)) {
            return [];
        }

        return admins.filter(admin => {
            const matchesCategory = roles.length === 0 || roles.includes(admin.role)
            const matchesSearch = searchTerm === '' || admin.fullname.toLowerCase().includes(searchTerm.toLowerCase()) || admin.email.toLowerCase().includes(searchTerm.toLowerCase())
            
            return matchesCategory && matchesSearch
        })
    }

    const sortedAndFilteredAdmins = useMemo(() => {
        return sortAdmins(filterAdmins(allAdmins, roleName, searchAdmin), sortValue);
    }, [allAdmins, roleName, searchAdmin, sortValue]) 


  return (
    <>
    {adminLoading ? (
        <Loader/>
    ) : (
        <>
        <AddNewAdmin popup={popup} setPopup={setPopup} />
        <div className=' w-full pl-[6rem] pr-[2.5rem] py-[3rem]'>
            <div className='flex flex-col justify-center items-start w-full h-full gap-[1rem]'>
                {allAdmins.length === 0 ? (
                    <div className='flex-center flex-col w-full pt-[3rem] gap-[1rem]'>
                        <div className='flex-center flex-col gap-[4rem] w-full'>
                            <img className='w-[35%]' src="/no-users.svg" alt="no admins" />
                            <h2 className='font-extrabold text-[35px] text-mediumGray'>No Admins Found</h2>
                        </div>
                    </div>
                ):(
                <>
                    <div className='w-full flex-center'>
                        <h1 className='font-extrabold text-[35px] text-mediumGray'>All Admins</h1>
                    </div>
                    <div className='flex justify-between w-full'>
                        <div className='flex gap-[1rem]'>
                            <FormControl size='small' sx={{ minWidth: 150 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Role</InputLabel>
                                <Select 
                                    value={roleName} 
                                    onChange={handleRoleNameChange}
                                    multiple
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    sx={{ borderRadius: '2px', textOverflow: 'ellipsis', maxWidth: 150 }}
                                    MenuProps={MenuProps}
                                    >
                                    {roles.map((role, key) => (
                                        <MenuItem key={key} value={role}>
                                            <Checkbox checked={roleName.indexOf(role) > -1}  />
                                            <ListItemText primary={role} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <FormControl size='small' sx={{ minWidth: 120 }}>
                                <InputLabel sx={{ fontFamily: 'Montserrat, sans-serif' }}>Sort By</InputLabel>
                                <Select
                                    input={<OutlinedInput label="Tag" />} 
                                    value={sortValue} 
                                    onChange={handleSortValueChange}
                                    sx={{ borderRadius: '2px' }}>
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="Name-A2Z">Name A-Z</MenuItem>
                                    <MenuItem value="Name-Z2A">Name Z-A</MenuItem>
                                    <MenuItem value="Email-A2Z">Email A-Z</MenuItem>
                                    <MenuItem value="Email-Z2A">Email Z-A</MenuItem>
                                    <MenuItem value="Old-New">Created At Old-New</MenuItem>
                                    <MenuItem value="New-Old">Created At New-Old</MenuItem>
                                </Select>
                            </FormControl>
                            {/* <Button sx={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontWeight: 600, borderRadius: '2px' }} onClick={handleMultipleRestoreModalOpen} variant='contained' color='customBlue'>Restore Products</Button>
                            <Modal 
                                open={multipleRestoreConfirmation}
                                onClose={handleMultipleRestoreModalClose}
                            >
                                <Box className="flex flex-col justify-between" sx={style}>
                                    <p className='text-[18px]'>You're Restoring {selectedProducts.length} products, Are you sure?</p>
                                    <Button
                                        variant='contained' 
                                        color='customBlue' 
                                        sx={{ fontFamily: 'Montserrat, sans-serif', color: '#444', fontWeight: 600, height: '2.5rem' }}
                                        onClick={handleMultipleProductsRestore}>
                                        Restore
                                    </Button>                                                    
                                </Box>
                            </Modal> */}
                        </div>
                        <div>
                            
                            <TextField 
                                variant='outlined' 
                                size='small' 
                                label='Search'
                                value={searchAdmin}
                                onChange={handleSearchAdmin}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position='start'>
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),  
                                    sx: { borderRadius: '2px', fontFamily: 'Montserrat, sans-serif', maxWidth: 220 }
                                }}
                            />
                        </div>
                    </div>
                    <TableContainer sx={{ boxShadow:5 }} component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="users table"> 
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'primary.main' }}>
                                    <TableCell sx={{...table_body_cell_properties, minWidth: 50, maxWidth: 50, border: 0, borderColor: 'transparent' }} align="center">
                                        <Checkbox
                                            indeterminate={selectedAdmins.length > 0 && selectedAdmins.length < allAdmins.length}
                                            checked={allAdmins.length > 0 && selectedAdmins.length === allAdmins.length}
                                            onChange={handleAllAdminSelect} 
                                            sx={{ display: 'flex', justifyContent: 'center', color: 'white', '&.Mui-checked': { color: 'white' }, '&.MuiCheckbox-indeterminate' : { color: 'white' } }}
                                            >
                                        </Checkbox>
                                    </TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Admin</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Email</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="left">Role</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 150, maxWidth: 150}} align="right">Created At</TableCell>
                                    <TableCell sx={{...table_head_cell_properties, minWidth: 100, maxWidth: 100}} align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {(rowsPerPage > 0
                                    ? sortedAndFilteredAdmins.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    : sortedAndFilteredAdmins).map((admin, key) => (
                                    <TableRow
                                        key={admin.id}
                                    >
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 50, maxWidth: 50}} align="center">
                                            <Checkbox 
                                                checked={selectedAdmins.includes(admin.id)}
                                                onChange={() => handleAdminCheckboxSelect(admin.id)}
                                                sx={{ display: 'flex', justifyContent: 'center' }}>
                                            </Checkbox>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 200, maxWidth: 200}} align="left">
                                            <div className='flex items-center w-full gap-[0.5rem]'>
                                                {/* <div className='max-h-[30px] max-w-[30px]'>
                                                    <img className='w-full h-full' src={product.image_url} alt={`${product.name} image`} />
                                                </div> */}
                                                <div className='overflow-hidden'>
                                                    <Tooltip title={admin.fullname} placement='bottom-start'>
                                                        <p className='font-semibold overflow-hidden text-ellipsis whitespace-nowrap'>{admin.fullname}</p>
                                                    </Tooltip>
                                                    <Tooltip title={admin.id} placement='bottom-start'>
                                                        <p className='text-[12px] font-normal overflow-hidden text-ellipsis whitespace-nowrap'>ID: {admin.id}</p>
                                                    </Tooltip>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, ...truncation_properties, minWidth: 300, maxWidth: 300}} align="left">
                                            <Tooltip title={admin.email} placement='bottom-start'>
                                                <p className='overflow-hidden text-ellipsis whitespace-nowrap'>{admin.email}</p>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="left">{admin.role}</TableCell>
                                        <TableCell sx={{...table_body_cell_properties, minWidth: 150, maxWidth: 200}} align="right">{admin.createdAt.split('T')[0]}</TableCell>
                                        <TableCell align="right">
                                            <div className='flex gap-[0.4rem] justify-center'>
                                                <Tooltip title="update role" placement="left" arrow>
                                                    <IconButton onClick={() => {handleUpdateModalOpen(admin.email, admin.role)}} aria-label='update' size='medium'><ModeEditIcon fontSize='inherit' /></IconButton>
                                                </Tooltip>
                                                <Tooltip title="delete" placement="right" arrow>
                                                    <IconButton onClick={() => {handleDeleteModalOpen(admin.id)}} aria-label='delete' size='medium'><DeleteIcon fontSize='inherit' /></IconButton>
                                                </Tooltip>  
                                                    <Modal 
                                                        open={deleteConfirmation}
                                                        onClose={handleDeleteModalClose}
                                                        >
                                                        <Box className="flex flex-col justify-between" sx={style}>
                                                            <p className='text-[18px]'>Are you sure about deleting?</p>
                                                            <Button
                                                                variant='contained' 
                                                                color='primary' 
                                                                sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, height: '2.5rem' }}
                                                                onClick={handleAdminDelete}>
                                                                Delete
                                                            </Button>                                                    
                                                        </Box>
                                                    </Modal>
                                                    <Modal 
                                                        open={updateConfirmation}
                                                        onClose={handleUpdateModalClose}
                                                        >
                                                        <Box className="flex flex-col justify-between gap-[1rem]" sx={{...style, height: 220}}>
                                                            <p className='text-[18px]'>Select the Role</p>
                                                            <select className={`cursor-pointer w-full bg-transparent border-[1px] border-lightGray2 hover:border-mediumGray rounded-[2px] py-[1rem] px-[1rem] ${adminRole === '' ? "text-mediumGray2" : "text-black"} bg-white`} value={adminRole} onChange={(e) => {setAdminRole(e.target.value)}} required>
                                                                {roles.map((role, key) => (
                                                                    <option className='text-mediumGray' value={role}>{role}</option>
                                                                ))}
                                                            </select>

                                                            <Button
                                                                variant='contained' 
                                                                color='primary' 
                                                                sx={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, height: '2.5rem' }}
                                                                onClick={handleAdminUpdate}
                                                                disabled={adminRole === '' ? true : false}>
                                                                Update
                                                            </Button>                                                    
                                                        </Box>
                                                    </Modal>
                                                    
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}    
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className='flex justify-between w-full'>
                        <Tooltip title="Add New Admin" placement='right' arrow>
                            <Fab onClick={handleAddNewAdminOpen} color='primary'>
                                <AddIcon />
                            </Fab>
                        </Tooltip>
                        <TablePagination 
                            component="div"
                            rowsPerPageOptions={[5, 10, 15, 20, { label: 'All', value: -1 }]}
                            colSpan={3}
                            count={sortedAndFilteredAdmins.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </div>
                </>
                )}

            </div>
        </div>
    </>
    )}
    </>
  )
}

export default ManageAdmins