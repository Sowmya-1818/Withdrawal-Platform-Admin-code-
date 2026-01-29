import { adminApiHandler, adminApiHandlerWithFile, adminApiHandlerWithoutToken, adminDownloadApiHandler } from "../ApiHandler";
import EncryptionUtil from "../EncryptionUtils";
import { REQUEST_METHODS } from "../RequestMethods";

export const cancelApiRequest = (controllers) => {
  for (const controller of controllers) {
    controller.abort();
  }
}

export const AdminRegistration = async (data, controller) => {
  try {
    const response = await adminApiHandlerWithoutToken(
      REQUEST_METHODS.POST,
      `/api/v1/admins/login`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const cancelFun = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/admin-users`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const cancelFun2 = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/transaction/history?page=1&limit=10`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


// export const AllUserApi = async (page, limit, controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/users/all-users?page=${page}&limit=${limit}`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

export const AllUserApi = async (page, limit, controller) => {
 
  const data = {page:page, limit:limit}
  console.log(data, 'allusers');
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/users/all-usersdub`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AllUserSearchApi = async (search, page, limit, controller) => {
  console.log(search, page, limit, controller, "search, page, limit, controller");
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/all-users?search=${search}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const ActiveUserApi = async (page, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/active?page=${page}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const ActiveUserSearchApi = async (search, page, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/active?search=${search}&page=${page}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const EmailUnverifiedApi = async (page, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/email-unverified?page=${page}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const EmailUnverifiedSearchApi = async (search, page, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/email-unverified?search=${search}&page=${page}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminAllWithdrawalMethods = async (currentPage, limit, controller) => {
 
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/all-withdraw?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const WalletCurrencyApi = async (controller) => {

  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminSearchwithdrawalMethod = async (search, status, startDate, endDate, searchUserId, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/all-withdraw?search=${search}&status=${status}&startDate=${startDate}&user_id=${searchUserId}&endDate=${endDate}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const UserListApi = async (controller) => {
  try {
    console.log(controller, "controller");
    
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/all-filter-users`,
      {},
      // data,
      controller
    );
    
    
    return response;
  } catch (error) {
    return error;
  }
}

export const UserDailyBonusApi = async (controller,search, limit,currentPage) => {
  // console.log(limit,currentPage, 'daily bonus');
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/daily-bonus?search=${search}&page=${currentPage}&limit=${limit}`,  

      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}


export const UserRefferalsApi = async (controller,search,limit,currentPage) => {
  console.log(limit,"limit",currentPage,"currentPage",search, 'Refferal bonus');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/referraldata?search=${search}&page=${currentPage}&limit=${limit}`,  

      {},
      controller
    );
    console.log(response,"response refferal");
    
    return response;
  } catch (error) {
    return error;
  }
}
export const UserTaskssApi = async (controller,search,limit,currentPage) => {
  console.log(limit,currentPage,search,'Tasks bonus');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/task-rewardpoints?search=${search}&page=${currentPage}&limit=${limit}`,  

      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminPendingWithdrawMethods = async (currentPage, limit, controller) => {
  console.log(currentPage, limit, controller,"manvitha");
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/pending?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminPendingSearchwithdrawal = async (search, startDate, endDate, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/pending?search=${search}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}


export const AdminRejectWithdrawMethods = async (currentPage, limit, controller) => {
  try {
    console.log(currentPage, limit, controller,"manvitha");
    
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/rejected?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminRejectgSearchwithdrawal = async (search, startDate, endDate, walletCurrency, currentPage, limit, controller) => {
  
  try {
    console.log(search, startDate, endDate, walletCurrency, currentPage, limit, controller);
    
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/rejected?search=${search}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameLogApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/games-invest?&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameWinApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/games-win?&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameLossApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/games-loss?&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GamelogsearchApi = async (searchUserId, searchUserId2, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/games-invest?user=${searchUserId}&game=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GamewinsearchApi = async (searchUserId, searchUserId2, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/games-win?user=${searchUserId}&game=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GamelosssearchApi = async (searchUserId, searchUserId2, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard/games-loss?user=${searchUserId}&game=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameUsersearchApi = async (searchUserId2, walletCurrency, id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-games-play/${id}?game=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameUserWinsearchApi = async (searchUserId2, walletCurrency, id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-games-win/${id}?game=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}
export const GameUserLosssearchApi = async (searchUserId2, walletCurrency, id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-games-loss/${id}?game=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameUserApi = async (id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-games-play/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameUserWinApi = async (id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-games-win/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GameUserLossApi = async (id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-games-loss/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}


export const GetWithdrawalDownloadApi = async (search, status, startDate, endDate, walletCurrency, searchUserId, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/withdraw-reports-download?search=${search}&status=${status}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${walletCurrency}&user_id=${searchUserId}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const AdminUpdateReferral = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/setting/general-setting`,
      data, controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const BotAdminGeneralSetting = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/setting/update-bot-setting`,
      data, controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

// export const AdminAddreferral = async (controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/setting/general-setting`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

export const AdminBonusApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bonus`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

// export const LoginBounsApi = async (controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/reward-plan/get-all`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// }
export const LoginBounsApi = async (id, controller) => {
  console.log(id, 'id get all');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/reward-plan/get-all/${id}`,
      {},
      controller
    );
   
    return response;
  } catch (error) {
    return error;
  }
}

export const LoginBonusActiveCurrency = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency/activeCurrencyList`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const usertasks = async (id, controller) => {
  console.log(id, 'id get all');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/gettusertasks/${id}`,
      {},
      controller
    );
    console.log(response, "responsegetusertasks");
    return response;
  } catch (error) {
    return error;
  }
}
// export const usertasks = async (id, controller) => {
//   try {
//     console.log("rtrthy");
    
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/users/gettusertasks/${id}`,
//       {},
//       controller
//     );
//     console.log(response, "responsegdfghdfbhgd");
//     return response;
   
  
//   } catch (error) {
//     return error;
//   }
// }

export const LoginBouns = async (formData, controller) => {
  console.log(formData, "formData");
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/reward-plan/Daily-Rewardplan`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const EditLoginBouns = async (data, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/bonus/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const GetbounsApi = async (controller, id) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bonus/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}


export const BonusLogApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bonus-logs/all?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const GetBonusSearchApi = async (search, trxType, startDate, endDate, searchUserId, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bonus-logs/all?search=${search}&trx=${trxType}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AddBounsApi = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/bonus`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const DeleteBonusApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/bonus/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminUserApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/admin-users`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const DeleteAdminUserApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/admin-users/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const EditAdminUserApi = async (data, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/admin-users/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const GetAdminApi = async (controller, id) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/admin-users/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const GetRoleApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/roles`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AddAdminUserApi = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/admin-users`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminRole = (controller) => {
  try {
    const response = adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/roles`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const AdminAddRole = (formData, controller) => {
  try {
    const response = adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/roles/store`,
      formData,
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}
export const AdminDeleteRole = (id, controller) => {
  try {
    const response = adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/roles/${id}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const AdminAllPermission = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/roles/allpermission`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const AdminRolePermission = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/roles/access/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminnUpdatePermission = (id, formData, controller) => {
  try {
    const response = adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/roles/${id}/access/store`,
      formData,
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const AdminUpdateRole = (formData, id, controller) => {
  try {
    const response = adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/roles/update/${id}`,
      formData,
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}
export const AddEditRole = (id, controller) => {
  try {
    const response = adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/roles/role/${id}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const AdminPermissions = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/permissions?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}
export const AdminAddPermission = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/permissions/store`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const AdminDeletePermission = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/permissions/${id}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}


export const AdminGetPermission = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/permissions/${id}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const AdminEditPermission = async (formData, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/permissions/update/${id}`,
      formData,
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const GetGameApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/games?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const DisableandEnableGameApi = async (id, formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/games/status/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const HandleDataApi = async (id, formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/games/data/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const EditGetGameApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/games/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const EditGameApi = async (formData, id, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/games/${id}`,
      formData,
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const GameListApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/getAllGames`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const DepositListApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/getAllDepositMethods`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const WithdrawListApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/getAllWithdrawMethods`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const GamesApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/games?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const BankrollFormApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bank-rolls/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const BankrollApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bank-roll-histroies/all/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const UpdateBankRollapi = async (formData, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/bank-rolls/update/${id}`,
      formData,
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const GetGameLogApi = async (currentPage, limit, controller) => {
 
  try {
  
    
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/gamelogs/history?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const AdminSearchGameLog = async (options,options1, walletCurrency, startDate, endDate, searchUserId, searchUserId2, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/gamelogs/history?win_status=${options}&BoosterActive=${options1}&wallet_currency=${walletCurrency}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&game=${searchUserId2}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const GetGameLogDownloadApi = async (options,options1, walletCurrency, startDate, endDate, searchUserId, searchUserId2, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/gamelogs-history/download?win_status=${options}&BoosterActive=${options1}&wallet_currency=${walletCurrency}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&game_id=${searchUserId2}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const BannedUserApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/banned?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const SearchBannedUserApi = async (search, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/banned?search=${search}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const DepositUserApi = async (id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-deposits/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const DepositUserSearchApi = async (search, searchUserId2, id, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-deposits/${id}?trx=${search}&gateway_id=${searchUserId2}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const LoginDetailsApi = async (id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-login-histiory/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

// export const UserLoginNotificationApi = async (id, currentPage, limit, controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/users/users-notifications/${id}?page=${currentPage}&limit=${limit}`,
//       {},
//       controller
//     );

//     return response;
//   } catch (error) {
//     return error;
//   }
// }

export const WithdrawUserApi = async (id, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-withdraw/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const UserdataWithdrawSearchApi = async (id, search, searchUserId2, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/users-withdraw/${id}?trx=${search}&method_id=${searchUserId2}wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const AdminWalletMethods = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-method`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminWalletMethodCurrency = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency/method-currency/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AddSubBalanceApi = async (data, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/users/addSubBalance/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AddBotBalanceApi = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/bot-admin/addbalance-boatuser`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const BotCheckBalanceApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bot-admin/getAllCheckBalance`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const BotUserCheckBalanceApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/bot-admin/getCheckBalance/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const banUseApi = async (formData, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/users/banned-status/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const unbanUserApi = async (formData, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/users/banned-status/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const AdminUserDetail = async (id, currency, Month, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/details/${id}?id=${currency}&day=${Month}`,
      {},
      controller
    );
console.log(response, "abhinav");
    return response;
  } catch (error) {
    return error;
  }
}

export const UserReferralsApi = async (id, currentPage, limit,controller) => {
  console.log(currentPage, limit, 'afsdfds');
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/referral/histroy/user/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const UserWalletsApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/user-wallet-history/${id}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const AdminUpdateUser = async (formData, id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/users/update-users/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
export const GetTimeApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/setting/get-time-zones`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const GeneralSettingApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/setting/general-setting`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}


export const SystemCofigurationUpdateApi = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/setting/system-configuration`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const BannerApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/banners`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}
export const BannerPagesApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/banners?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const AddBannerApi = async (formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.POST,
      `/api/v1/admins/banners/store`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const DeleteBannerApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/banners/${id}`,
      {},
      controller
    );
    return response;
  }
  catch (error) {
    return error;
  }
}

export const GetBannerApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/banners/${id}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}
export const EditBannerApi = async (id, formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/banners/update/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const LogoIconUpdateApi = async (formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.POST,
      `/api/v1/admins/setting/update-logo-icon`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }

}

export const FaviconUpdateApi = async (formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.POST,
      `/api/v1/admins/setting/update-favicon-icon`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }

}

export const KycSettingApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/kyc`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const DeleteKycApi = async (id, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/kyc/${id}`,
      {},
      controller,
    );
    return response;
  }
  catch (error) {
    return error;
  }
}
export const GetKycApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/kyc/${id}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const EditKycApi = async (id, formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/kyc/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }

}
export const AddKycApi = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/kyc`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}


export const ManagePagesApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/pages`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}


export const AddpagesApi = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/pages/store`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }

}

export const DeletePageApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/pages/${id}`,
      {},
      controller,
    );
    return response;
  }
  catch (error) {
    return error;
  }
}
export const GetPageApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/pages/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const EditPagesApi = async (formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/pages/store`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }

}

export const AdminDashboardApi = async (currency, Month, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/dashboard?id=${currency}&day=${Month}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminMeApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/me`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}
// export const AdminNotificationApi = async (controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/notification`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// }

export const AdminAccessApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/roles/user-access`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

// export const NotificationStatusChangeApi = async (id, controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.POST,
//       `/api/v1/admins/notification/${id}`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }

// }

export const AdminGeneralApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/setting/general-setting`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const GetBonusLogDownloadApi = async (startDate, endDate, searchUserId, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/user-reports-download?startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GetGamesLogDownloadApi = async (options, walletCurrency, startDate, endDate, searchUserId, searchUserId2, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/user-reports-download?win_status=${options}&wallet_currency=${walletCurrency}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&game_id=${searchUserId2}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetDepositdataApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/all-deposit?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetWalletCurrencyApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

// =======>

export const GetPendingDepositsApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/pending?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const AdminPendingSearchDeposits = async (search, startDate, endDate, searchUserId, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/pending?search=${search}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const GetApprovedDepositsApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/approved?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetApprovedDepositsSearchApi = async (search, startDate, endDate, searchUserId, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/approved?search=${search}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetRejectedDepositsApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/rejected?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const AdminRejectgSearchDeposits = async (search, startDate, endDate, searchUserId, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/rejected?search=${search}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const handleDepositsApproveApi = async (_id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/deposit/approve/${_id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};



// =======>




export const GetDepositdataSearchApi = async (search, startDate, endDate, searchUserId, searchStatus, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/all-deposit?search=${search}&startDate=${startDate}&endDate=${endDate}&user_id=${searchUserId}&status=${searchStatus}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const GetDepositDownloadApi = async (search, startDate, endDate, searchStatus, walletCurrency, searchUserId, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/deposit-reports-download?search=${search}&startDate=${startDate}&endDate=${endDate}&status=${searchStatus}&wallet_currency=${walletCurrency}&user_id=${searchUserId}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GetApprovedWithdrawalsApi = async (search,startDate, endDate,currentPage, limit,Symbol, controller) => {
  console.log(search,startDate, endDate,currentPage, limit, controller,"manvitha");
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/approved?search=${search}&startDate=${startDate}&endDate=${endDate}&page=${currentPage}&limit=${limit}&Symbol=${Symbol}`,
      {},
      controller
    );
    console.log(response, "responseadminApiHandler");
    
    return response;
  } catch (error) {
    return error;
  }
};
export const GetApprovedWithdrawalsSearchApi = async (search,options, startDate, endDate, walletCurrency, currentPage, limit, controller) => {
  console.log(search, startDate, endDate, walletCurrency, currentPage, limit, controller,"manvitha")
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/approved?search=${search}&options=${options}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetChargedWithdrawalsApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/charges-withdraw?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GettransferredWithdrawalsApi = async (search,startDate, endDate,currentPage,filterData, limit, Symbol,controller ) => {
  console.log(search,startDate, endDate,currentPage, limit, controller,filterData,"manvithatransfer");
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/transferredwithdraw?search=${search}&startDate=${startDate}&endDate=${endDate}&page=${currentPage}&limit=${limit}&Symbol=${Symbol}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GettransferredWithdrawaldataApi = async (id, currentPage, limit,controller) => {
  
  console.log(controller,"controller adminapis");
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/transferredwithdrawdata/${id}?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    // console.log(response, 'response pichiapi');
    return response;
  } catch (error) {
    return error;
  }
}

export const AdmintransferedSearchwithdrawal = async (search, startDate, endDate, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/transferredwithdraw?search=${search}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    console.log(response, 'response pichiapifgh');
    
    return response;
  } catch (error) {
    return error;
  }
}

export const GetAdsrewarddataApi = async (id, currentPage, limit,options,startDate, endDate,controller) => {
  
  console.log(controller,"controller adminapis");
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/Adsrewarddata/${id}?page=${currentPage}&limit=${limit}&options=${options}&startDate=${startDate}&endDate=${endDate}`,
      {},
      controller
    );
    console.log(response, 'response pichiapi');
    return response;
  } catch (error) {
    return error;
  }
}
export const GetChargedWithdrawalsSearchApi = async (search, startDate, endDate, walletCurrency, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/charges-withdraw?search=${search}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${walletCurrency}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const GetAllDepositDetailsApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/deposit/details/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetDownloadsDeleteApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/download-requests/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GetDownloadsApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/download-requests/all?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetLoginApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/login-histories?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetLoginSearchApi = async (currentPage, search, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/login-histories?page=${currentPage}&search=${search}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

// export const GetDepositApi = async (currentPage, limit, controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/report/notification/history?page=${currentPage}&limit=${limit}`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

// export const GetNotificationSearchApi = async (search, currentPage, limit, controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/report/notification/history?search=${search}&page=${currentPage}&limit=${limit}`,
//       {},
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// };


export const TransactionListApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/transaction/history?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const TransactionSearchApi = async (currentPage, remark, trx_type, trx, startDate, endDate, currency, search, searchUserId, gameId, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/transaction/history?page=${currentPage}&remark=${remark}&trx_type=${trx_type}&trx=${trx}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${currency}&search=${search}&user_id=${searchUserId}&game=${gameId}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetTransactionHistoryDownloadApi = async (remark, trx_type, trx, startDate, endDate, currency, search, searchUserId, gameId, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/transaction-history/download?remark=${remark}&trx_type=${trx_type}&trx=${trx}&startDate=${startDate}&endDate=${endDate}&wallet_currency=${currency}&search=${search}&user_id=${searchUserId}&game=${gameId}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const CurrencyApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetUserdataApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/user-reports?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const GetUserDataSearchApi = async (searchUserId, startDate, endDate, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/user-reports?user_id=${searchUserId}&startDate=${startDate}&endDate=${endDate}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetUserdataDownloadApi = async (startDate, endDate, controller) => {
  try {
    const response = await adminDownloadApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/report/user-reports-download?startDate=${startDate}&endDate=${endDate}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleCurrencyStoreApi = async (formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.POST,
      `/api/v1/admins/wallet-currency/store`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleCurrencySearchApi = async (search, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency?search=${search}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GetDeleteCurrencysApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/wallet-currency/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const GetCurrencysApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetUpdateCurrencysApi = async (id, formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/wallet-currency/update/${id}`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetWalletMethods = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-method`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetSupportTicketApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/ticket/all?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetAnswerTicketApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/ticket/answer?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetClosedTicketApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/ticket/closed?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleDeleteTicketApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/ticket/close-ticket/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleDeleteTicketMessageApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/ticket/delete-message/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetPendingTicketApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/ticket/pending?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetDepositDetailsApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/ticket/detail/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const HandleReply = async (id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/ticket/replay-ticket/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetMobileUnverifiedApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/mobile-unverified?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetMobileUnverifiedSearchApi = async (search, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/mobile-unverified?search=${search}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};



export const GetMobileverifiedApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/mobile-verified?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetMobileverifiedSearchApi = async (search, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/users/mobile-verified?search=${search}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleNotificationSubmit = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/usernotification`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const handleWalletStoreApi = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/wallet-method/store`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleDeleteWalletApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/wallet-method/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const GetMethodsApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-method/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const WallethandleSubmitApi = async (id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/wallet-method/update/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleWihdrawApproveApi = async (_id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/withdraw/approve/${_id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const handleWihdrawRejectApi = async (_id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/withdraw/reject/${_id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const GetWithdrawDetail = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw/details/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetCurrencyApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/wallet-currency/method-currency/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const HandleSubmitWithdrawals = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/withdraw-method/store`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetWithdrawalsApis = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw-method/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const UpdateWithdrawalsApi = async (id, data, controller) => {
  console.log(data, 'data manu');
  
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/withdraw-method/update/${id}`,
      data,
      controller
    );
    console.log(response, "response from UpdateWithdrawalsApi");
    return response;
  } catch (error) {
    return error;
  }
};

export const GetWithdrawalsApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw-method?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetWithdrawalsSearchApi = async (search, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/withdraw-method?search=${search}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const WithdrawStatusAPi = async (id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/withdraw-method/status/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const DepositStatusAPi = async (id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/gateway/manual/status/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


// Deposit Methods Api start

export const GetDepositMethodApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/gateway/manual?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetDepositMethodSearchApi = async (search, currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/gateway/manual?search=${search}&page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const HandleSubmitDepositApi = async (data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/gateway/manual`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetDepositUPdateApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/gateway/manual/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const handleSubmitDepositApi = async (id, data, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/gateway/manual/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

// Deposit Methods Api end
export const AdminProfileApi = async (formData, controller) => {
  try {
    const response = await adminApiHandlerWithFile(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/update-profile`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminChangePasswordApi = async (id, formData, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      // `/api/v1/admins/change-password/${id}`,
      `/api/v1/admins/change-password/`,
      formData,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AdminForgetPasswordApi = async (data, controller) => {
  try {
    const response = await adminApiHandlerWithoutToken(
      REQUEST_METHODS.POST,
      `/api/v1/admins/forgot-password`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const AdminResetPasswordApi = async (token, data, controller) => {
  try {
    const response = await adminApiHandlerWithoutToken(
      REQUEST_METHODS.PATCH,
      `/api/v1/admins/resetPassword/${token}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetUserMessageApi = async (currentPage, limit, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/message/Get?page=${currentPage}&limit=${limit}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const DeleteUserMessageApi = async (id, controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/message/delete/${id}`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
}

export const AllDeleteUserMessageApi = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.DELETE,
      `/api/v1/admins/message/all-delete`,
      {},
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
} 
export const adminAddtasks = async (data, controller) => {
  console.log(controller, "abhinav");
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/addtask`,
      data,
      // id,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetTasks = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/gettask`,
      {},
      controller
    );
    // console.log(response, "response gettask")
    return response;
  } catch (error) {
    return error;
  }
};
export const adminEdittasks = async (data, controller) => {
  // console.log(data, '/n',controller, 'dataijdfk');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/addtask`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const adminAirdrop = async (data, controller) => {
  // console.log(data, '/n',controller, 'dataijdfk');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/userleaderboard`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const adminMonthlyAirdrop = async (data, controller) => {
  console.log(data, '/n',controller, 'dataijdfk');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/RefferalLeaderBoardReset`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const adminAddleaderboard = async (data,id,controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/leaderboardsettings`,
      data,
      id,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const adminEditleaderboard = async (data, controller) => {
  // console.log(data, '/n',controller, 'dataijdfk');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/leaderboardsettings`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GetLeaderboardSettings = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/getleaderboard`,
      {},
      controller
    );
    // console.log(response, "response gettask")
    return response;
  } catch (error) {
    return error;
  }
};

export const GetweeklyLeaderboard = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/weeklyleaderboard`,
      {},
      controller
    );
    console.log(response, "response gettask")
    return response;
  } catch (error) {
    return error;
  }
};

export const GetMonthlyRefLeaderboard = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/TopRefferalLeaderboarddata`,
      {},
      controller
    );
    // console.log(response, "response gettask")
    return response;
  } catch (error) {
    return error;
  }
};

export const adminAddtokens = async (data,id,controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/addtokens`,
      data,
      id,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const GetTokendata = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/gettokens`,
      {},
      controller
    );
    // console.log(response, "response gettask")
    return response;
  } catch (error) {
    return error;
  }
};

export const adminEdittokens = async (data, controller) => {
  console.log(data, '/n',controller, 'dataijdfk');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/addtokens`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const transfertowallet = async (data, controller) => {
  console.log(data, 'adafn');
  
 
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/withdraw/transfer`,
      data,
      controller
    );
    return response;
  } catch (error) {
    console.error('Error in transfertowallet:', error.response ? error.response.data : error);
    return error;
  }
};


export const AdminRefreshTokenApi = async (refreshStatus, setRefreshStatus) => {
  var AdminRefreshToken = EncryptionUtil.decryptionAES(localStorage.getItem('adminRefreshToken'));
  const controller = new AbortController();

  const formData = {
    refresh_token: AdminRefreshToken
  }
  try {
    const response = await adminApiHandlerWithoutToken(
      REQUEST_METHODS.POST,
      `/api/v1/admins/refreshToken`,
      formData,
      controller
    );
    console.log(response, "response");
    if (response.status === 200) {
      var encryptedToken = EncryptionUtil.encryptionAES(response.data.data.token);
      localStorage.setItem('adminToken', encryptedToken);
      var encryptedToken2 = EncryptionUtil.encryptionAES(response.data.data.refreshToken);
      localStorage.setItem('adminRefreshToken', encryptedToken2);
      setRefreshStatus(!refreshStatus);
    } else {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminRefreshToken');
      window.location.reload();
    }
    return response;
  } catch (error) {
    return error;
  }
}

// export const adminManageReferral= async (data,controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.POST,
//       `/api/v1/admins/setting/general-settingreferral`,
//       data,
//       controller
//     );
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

// export const Getreferraladmin = async (controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/setting/getreferraladmin`,
//       {},
//       controller
//     );

//     return response;
//   } catch (error) {
//     return error;
//   }
// }


export const CreateBooster = async (data,controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/booster/createBooster`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const GetBoostersadmin = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/booster/getAllBoosters`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}

export const GetBoostersSettings = async (controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/booster/getAllsettings`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}
export const GetBoostersSettingsById = async (id,controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      `/api/v1/admins/booster/getsettings/${id}`,
      {},
      controller
    );

    return response;
  } catch (error) {
    return error;
  }
}


export const CreateBoosterSettings = async (data,controller) => {
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/booster/createsettings`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};


export const adminEditboosters = async (id,data, controller) => {
  // console.log(data, '/n',controller, 'dataijdfk');
  try {
    const response = await adminApiHandler(
      REQUEST_METHODS.POST,
      `/api/v1/admins/booster/updateBooster/${id}`,
      data,
      controller
    );
    return response;
  } catch (error) {
    return error;
  }
};

// export const GetBoosterTransactions = async (controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/booster/UserBoosters`,
//       {},
//       controller
//     );
//     console.log(response,"responseuserlist");
//     return response;
//   } catch (error) {
//     return error;
//   }
// }
// export const BoosterBounsApi = async (id, controller) => {
//   console.log(id, 'id get all');
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/booster/getBooster/${id}`,
//       {},
//       controller
//     );
   
//     return response;
//   } catch (error) {
//     return error;
//   }
// }


// export const GetBoosterTransactions = async (currentPage, limit,search,  startDate, endDate, controller) => {
//   try {
//     const response = await adminApiHandler(
//       REQUEST_METHODS.GET,
//       `/api/v1/admins/booster/UserBoosters?page=${currentPage}&limit=${limit}&search=${search}&startDate=${startDate}&endDate=${endDate}`,
//       {},
//       controller
//     );
//     console.log(response,"responseuserlist");
//     return response;
//   } catch (error) {
//     return error;
//   }
// };

export const GetBoosterTransactions = async (currentPage, limit, search, startDate, endDate, controller) => {
  try {
    // Log the parameters for debugging purposes
    console.log('Requesting booster transactions with params:', { currentPage, limit, search, startDate, endDate });

    // Construct the API URL with query parameters
    const url = `/api/v1/admins/booster/UserBoosters?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(search)}&startDate=${startDate}&endDate=${endDate}`;

    // Make the GET request using the adminApiHandler
    const response = await adminApiHandler(
      REQUEST_METHODS.GET,
      url,
      {}, // You can pass additional headers or body data here if necessary
      controller // Pass the controller if it's being used for aborting requests
    );

    // Log the response for debugging
    console.log(response, "responseuserlist");

    // Return the API response
    return response;

  } catch (error) {
    // Log the error to get more details
    console.error('Error in GetBoosterTransactions API call:', error);

    // Return the error to handle it in the calling function
    return { error: error.message || 'Something went wrong' };
  }
};
