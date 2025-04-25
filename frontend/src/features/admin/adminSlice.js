import { createSlice } from "@reduxjs/toolkit";
import {
    adminGetAllAdmins,
    adminGetAllSellerApplications,
    adminGetAllSellers,
    adminGetAllUsers,
    adminLogin,
    adminLogout,
    deleteAdmin,
    deleteSeller,
    deleteUser,
    approveSeller,
    rejectSeller,
    loadadminuser,
    updateAdminRole,
    addNewAdmin,
} from "./adminThunks";

const initialState = {
    admin: {},
    allAdmins: [],
    allUsers: [],
    allSellers: [],
    allSellerApplications: [],
    adminLoading: false,
    isAdminAuthenticated: false,
    adminMessage: null,
    adminError: null,
};

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        clearAdminMessage: (state) => {
            state.adminMessage = null;
        },
        clearAdminError: (state) => {
            state.adminError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            //admin Login pending
            .addCase(adminLogin.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    isAdminAuthenticated: false,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //admin Login fulfilled
            .addCase(adminLogin.fulfilled, (state, action) => {
                return {
                    ...state,
                    admin: action.payload.admin,
                    adminLoading: false,
                    isAdminAuthenticated: true,
                };
            })

            //admin Login rejected
            .addCase(adminLogin.rejected, (state, action) => {
                return {
                    ...state,
                    admin: null,
                    adminLoading: false,
                    isAdminAuthenticated: false,
                    adminError: action.payload,
                };
            })

            //admin Logout pending
            .addCase(adminLogout.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    isAdminAuthenticated: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //admin Logout fulfilled
            .addCase(adminLogout.fulfilled, (state, action) => {
                return {
                    ...state,
                    admin: null,
                    adminLoading: false,
                    isAdminAuthenticated: false,
                    adminMessage: action.payload.message,
                };
            })

            //admin Logout rejected
            .addCase(adminLogout.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminError: action.payload,
                };
            })

            //get all users pending
            .addCase(adminGetAllUsers.pending, (state) => {
                return {
                    ...state,
                    allAdmins: [],
                    allUsers: [],
                    allSellers: [],
                    allSellerApplications: [],
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //get all users fulfilled
            .addCase(adminGetAllUsers.fulfilled, (state, action) => {
                return {
                    ...state,
                    allUsers: action.payload.users,
                    adminLoading: false,
                };
            })

            //get all users rejected
            .addCase(adminGetAllUsers.rejected, (state) => {
                return {
                    ...state,
                    allUsers: [],
                    adminLoading: false,
                };
            })

            //get all admins pending
            .addCase(adminGetAllAdmins.pending, (state) => {
                return {
                    ...state,
                    allAdmins: [],
                    allUsers: [],
                    allSellers: [],
                    allSellerApplications: [],
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //get all admins fulfilled
            .addCase(adminGetAllAdmins.fulfilled, (state, action) => {
                return {
                    ...state,
                    allAdmins: action.payload.admins,
                    adminLoading: false,
                };
            })

            //get all admins rejected
            .addCase(adminGetAllAdmins.rejected, (state) => {
                return {
                    ...state,
                    allAdmins: [],
                    adminLoading: false,
                };
            })

            //get all sellers pending
            .addCase(adminGetAllSellers.pending, (state) => {
                return {
                    ...state,
                    allAdmins: [],
                    allUsers: [],
                    allSellers: [],
                    allSellerApplications: [],
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //get all sellers fulfilled
            .addCase(adminGetAllSellers.fulfilled, (state, action) => {
                return {
                    ...state,
                    allSellers: action.payload.sellers,
                    adminLoading: false,
                };
            })

            //get all sellers rejected
            .addCase(adminGetAllSellers.rejected, (state) => {
                return {
                    ...state,
                    allSellers: [],
                    adminLoading: false,
                };
            })

            //get all seller applications pending
            .addCase(adminGetAllSellerApplications.pending, (state) => {
                return {
                    ...state,
                    allAdmins: [],
                    allUsers: [],
                    allSellers: [],
                    allSellerApplications: [],
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //get all seller applications fulfilled
            .addCase(
                adminGetAllSellerApplications.fulfilled,
                (state, action) => {
                    return {
                        ...state,
                        allSellerApplications: action.payload.pendingSellers,
                        adminLoading: false,
                    };
                },
            )

            //get all seller applications rejected
            .addCase(adminGetAllSellerApplications.rejected, (state) => {
                return {
                    ...state,
                    allSellerApplications: [],
                    adminLoading: false,
                };
            })

            //delete admin pending
            .addCase(deleteAdmin.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //delete admin fulfilled
            .addCase(deleteAdmin.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allAdmins: state.allAdmins.filter(
                        (admin) => admin.id !== action.payload.adminId,
                    ),
                    adminMessage: action.payload.message,
                };
            })

            //delete admin rejected
            .addCase(deleteAdmin.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminError: action.payload,
                };
            })

            //delete user pending
            .addCase(deleteUser.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //delete user fulfilled
            .addCase(deleteUser.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allUsers: state.allUsers.filter(
                        (user) => user.id !== action.payload.userId,
                    ),
                    adminMessage: action.payload.message,
                };
            })

            //delete user rejected
            .addCase(deleteUser.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminError: action.payload,
                };
            })

            //delete seller pending
            .addCase(deleteSeller.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //delete seller fulfilled
            .addCase(deleteSeller.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allSellers: state.allSellers.filter(
                        (seller) => seller.id !== action.payload.sellerId,
                    ),
                    adminMessage: action.payload.message,
                };
            })

            //delete seller rejected
            .addCase(deleteSeller.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminError: action.payload,
                };
            })

            //approve seller pending
            .addCase(approveSeller.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //approve seller fulfilled
            .addCase(approveSeller.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allSellerApplications: state.allSellerApplications.filter(
                        (application) =>
                            application.id !== action.payload.applicationId,
                    ),
                    adminMessage: action.payload.message,
                };
            })

            //approve seller rejected
            .addCase(approveSeller.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allSellerApplications: [],
                    adminError: action.payload,
                };
            })

            //reject seller pending
            .addCase(rejectSeller.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //reject seller fulfilled
            .addCase(rejectSeller.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allSellerApplications: state.allSellerApplications.filter(
                        (application) =>
                            application.id !== action.payload.applicationId,
                    ),
                    adminMessage: action.payload.message,
                };
            })

            //reject seller rejected
            .addCase(rejectSeller.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    allSellerApplications: [],
                    adminError: action.payload,
                };
            })

            //change admin role pending
            .addCase(updateAdminRole.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //change admin role fulfilled
            .addCase(updateAdminRole.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminMessage: action.payload.message,
                    allAdmins: action.payload.adminUsers,
                };
            })

            //change admin role rejected
            .addCase(updateAdminRole.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminError: action.payload,
                };
            })

            //add new admin pending
            .addCase(addNewAdmin.pending, (state) => {
                return {
                    ...state,
                    adminLoading: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //add new admin fulfilled
            .addCase(addNewAdmin.fulfilled, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminMessage: action.payload.message,
                    allAdmins: [...state.allAdmins, action.payload.adminUser],
                };
            })

            //add new admin rejected
            .addCase(addNewAdmin.rejected, (state, action) => {
                return {
                    ...state,
                    adminLoading: false,
                    adminError: action.payload,
                };
            })

            //load admin user pending
            .addCase(loadadminuser.pending, (state) => {
                return {
                    ...state,
                    admin: null,
                    adminLoading: true,
                    isAdminAuthenticated: false,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //load admin user fulfilled
            .addCase(loadadminuser.fulfilled, (state, action) => {
                return {
                    ...state,
                    admin: action.payload.adminUser,
                    adminLoading: false,
                    isAdminAuthenticated: true,
                    adminMessage: null,
                    adminError: null,
                };
            })

            //load admin user rejected
            .addCase(loadadminuser.rejected, (state) => {
                return {
                    ...state,
                    admin: null,
                    adminLoading: false,
                    isAdminAuthenticated: false,
                    adminMessage: null,
                    adminError: null,
                };
            });
    },
});

export const { clearAdminMessage, clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
