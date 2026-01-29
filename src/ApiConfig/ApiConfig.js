 
export const baseurl = "https://stringwithdrawadminback.stringgames.io";
export const baseurlretro = "https://tele-retroback.stringarc8.io"; 
export const baseurlmodren = "https://tele-modback.stringarc8.io"; 
export const baseurlspin = "https://rouletteadminback.stringgames.io"; 
export const baseurlstringgames = "https://stradminapi.stringgames.io"; 
export const baseurlcarrace = "https://st-ba-drive.stringdrive.io";
export const baseurltetris = "https://stringtetris.com/backapi";



// export const baseurl = "https://tontestback.strtesting.com";
// export const baseurlretro = "https://retroback.strtesting.com"; 
// export const baseurlmodren = "https://modback.strtesting.com"; 
// export const baseurlspin = "https://rouletteback.strtesting.com"; 
// export const baseurlstringgames = "https://apiadmin-telegames.strtesting.com"; 
// export const baseurlcarrace = "https://raceback.bonzi.xyz";
// export const baseurltetris = "https://tetrisbackend.bonzi.xyz";


export const urlretro = `${baseurlretro}/api/v1`;
export const urlmodren = `${baseurlmodren}/api/v1`;
const urlspin = `${baseurlspin}/v1`;
const urlstringgames = `${baseurlstringgames}/api/v1`;
const urlcarrace = `${baseurlcarrace}`;
const urltetris = `${baseurltetris}`;
const url = `${baseurl}`;

const ApiConfig = {
  //ADMIN AUTH
  login: `${url}/login`,
  loginretro: `${urlretro}/admin/login`,
  loginmodren: `${urlmodren}/admin/login`,
  loginspin: `${urlspin}/auth/login`,
  loginstringgames: `${urlstringgames}/admin/login`,
  logincarrace: `${urlcarrace}/api/auth/adminlogin`,
  logintetris: `${urltetris}/api/auth/adminlogin`,

  forgotPassword: `${url}/admin/forgotPassword`,
  verifyOTP: `${url}/admin/verifyOTP`,
  resetPassword: `${url}/admin/resetPassword`,
  changePassword: `${url}/admin/changePassword`,
  getProfile: `${url}/admin/getProfile`,
  editProfile: `${url}/admin/editProfile`,
  resendOtp: `${url}/admin/resendOtp`,
  graphDW: `${url}/admin/graphDW`,
  getUserActivity: `${url}/admin/getUserActivity`,
  userNameBlock: `${url}/admin/userNameBlock`,
  listBlockedUserName: `${url}/admin/listBlockedUserName`,
  deleteBlockedUserName: `${url}/admin/deleteBlockedUserName`,
  activeSelectedUser: `${url}/admin/activeSelectedUser`,
  deleteSelectedUserName: `${url}/admin/deleteSelectedUserName`,
  editBlockedUserName: `${url}/admin/editBlockedUserName`,
  approvedEmail: `${url}/admin/approvedEmail`,
  graphGameScoreAll: `${url}/admin/graphGameScoreAll`,
  graphUserGameHistory: `${url}/admin/graphUserGameHistory`,
  dashboardV1: `${url}/admin/dashboardV1`,
  userDashboard: `${url}/admin/userDashboard`,

  editAdminWallet: `${url}/admin/editAdminWallet`,
  ReferralTicketManagement: `${url}/admin/settings`,

  //USER MANAGEMENT
  userList: `${url}/admin/userList`,
  viewUser: `${url}/admin/viewUser`,
  deleteUser: `${url}/admin/deleteUser`,
  activeBlockUser: `${url}/admin/activeBlockUser`,
  editUserProfile: `${url}/admin/editUserProfile`,
  userReferredList: `${url}/admin/userReferredList`,
  getUserGameHistory: `${url}/admin/getUserGameHistory`,

  //CATEGORY MANAGEMENT
  listCategory: `${url}/category/listCategory`,
  adminListCategory: `${url}/category/adminListCategory`,
  deleteCategory: `${url}/category/deleteCategory`,
  viewCategory: `${url}/category/viewCategory`,
  editCategory: `${url}/category/editCategory`,
  activeDeactiveCategory: `${url}/category/activeDeactiveCategory`,
  addCategory: `${url}/category/addCategory`,

  //STATIC MANAGEMENT
  staticContentList: `${url}/static/staticContentList`,
  viewStaticContent: `${url}/static/viewStaticContent`,
  editStaticContent: `${url}/static/editStaticContent`,
  addStaticContent: `${url}/static/addStaticContent`,

  //FAQ MANAGEMENT
  faqList: `${url}/static/faqList`,
  deleteFAQ: `${url}/static/deleteFAQ`,
  editFAQ: `${url}/static/editFAQ`,
  addFAQ: `${url}/static/addFAQ`,
  viewFAQ: `${url}/static/viewFAQ`,

  //TICKET MANAGEMENT
  getTickets: `${url}/ticket/getTickets`,
  createTicket: `${url}/ticket/createTicket`,
  updateTicket: `${url}/ticket/updateTicket`,
  blockTicket: `${url}/ticket/blockTicket`,
  deleteTicket: `${url}/ticket/deleteTicket`,
  viewTicket: `${url}/ticket/viewTicket`,

  //GAME MANAGEMENT
  listgame: `${url}/game/listgame`,
  listGameAll: `${url}/game/listGameAll`,
  editgame: `${url}/game/editgame`,
  addGame: `${url}/game/addGame`,
  viewgame: `${url}/game/viewgame`,
  activeDeactiveGame: `${url}/game/activeDeactiveGame`,
  deletegame: `${url}/game/deletegame`,


  // .post("/addAds", controller.AddAds)
  // .put("/editAds", controller.AddAds)
  // .get("/getAds", controller.GetAds);

  getAds: `${url}/ads/getAds`,
  editAds: `${url}/ads/editAds`,
  addAds: `${url}/ads/addAds`,

  // /api/v1/Booster
  getBoosters: `${url}/Booster/getBoosters`,
  editBoosters: `${url}/Booster/editBoosters`,
  addBoosters: `${url}/Booster/addBoosters`,


  createBoostersetting: `${url}/Booster/createBoostersetting`,
  getBoostersetting: `${url}/Booster/getBoostersetting`,

  getUserBoosters: `${url}/Booster/getUserBoosters`,
 

  getrewards: `${url}/rewards/getrewards`,
  editrewards: `${url}/rewards/editrewards`,
  addrewards: `${url}/rewards/addrewards`,

  //Task MANAGEMENT
  // listgame: `${url}/game/listgame`,
  // listGameAll: `${url}/game/listGameAll`,
  // editgame: `${url}/game/editgame`,
  addTask: `${url}/task/addTask`,
  editTask: `${url}/task/editTask`,
  getTask: `${url}/task/getTask`,
  // viewgame: `${url}/game/viewgame`,
  // activeDeactiveGame: `${url}/game/activeDeactiveGame`,
  // deletegame: `${url}/game/deletegame`,

  //NOTIFICATION MANAGEMENT
  listNotification: `${url}/notification/listNotification`,
  viewNotification: `${url}/notification/viewNotification`,
  deleteNotification: `${url}/notification/deleteNotification`,

  //WALLET MANAGEMENT
  transactionHistory: `${url}/ticket/transactionHistory`,
  viewTransactionHistory: `${url}/ticket/viewTransactionHistory`,
  approveRejectWithdrawal: `${url}/ticket/approveRejectWithdrawal`,

  approveRejectWithdrawalretro: `${urlretro}/ticket/approveRejectWithdrawal`,
  approveRejectWithdrawalmodren: `${urlmodren}/ticket/approveRejectWithdrawal`,


  withdrawsettings: `${url}/ticket/withdrawsettings`,
  getwithdrawsettings: `${url}/ticket/getwithdrawsettings`,


  getwithdrawsettingsretro: `${urlretro}/ticket/getwithdrawsettings`,
  getwithdrawsettingsmodren: `${urlmodren}/ticket/getwithdrawsettings`,



  gettransactionHistoryretro: `${urlretro}/ticket/transactionHistory`,
  gettransactionHistorymodren: `${urlmodren}/ticket/transactionHistory`,


   getallwithdrawstatus: `${urlcarrace}/api/auth/getallwithdrawstatus`,
   transferWithdraw: `${urlcarrace}/api/auth/transferWithdraw`,
   getWithdrawLimits: `${urlcarrace}/api/auth/getWithdrawLimits`,


   getallwithdrawstatusTetris: `${urltetris}/api/auth/getallwithdrawstatus`,
   transferWithdrawTetris: `${urltetris}/api/auth/transferWithdraw`,
   getWithdrawLimitsTetris: `${urltetris}/api/auth/getWithdrawLimits`,



  Pending: `${urlspin}/solpayments/get-withdrawal-requests`,

  approvereject: `${urlspin}/solpayments/approve-reject`,

  withdrawmethods: `${urlspin}/solpayments/withdraw-methods`,
  
  getwithdrawmethods: `${urlspin}/solpayments/get-withdraw-methods`,
 

  allHistories: `${url}/admin/allHistories`,


  //DASHBOARD MANAGEMENT
  dashBoard: `${url}/admin/dashBoard`,

  //ANNOUNCEMENT MANAGEMENT
  listAnnouncement: `${url}/notification/listAnnouncement`,
  deleteAnnouncement: `${url}/notification/deleteAnnouncement`,
  viewAnnouncement: `${url}/notification/viewAnnouncement`,
  updateAnnouncement: `${url}/notification/updateAnnouncement`,
  // addAnnouncement: `${url}/notification/addAnnouncement`,
  SendNotification: `${url}/notification/SendNotification`,

  //BANNER MANAGEMENT
  addBanner: `${url}/banner/addBanner`,
  listBanner: `${url}/banner/listBanner`,
  viewBanner: `${url}/banner/viewBanner`,
  editBanner: `${url}/banner/editBanner`,
  deleteBanner: `${url}/banner/deleteBanner`,
  activeDeactiveBanner: `${url}/banner/activeDeactiveBanner`,

  //CONTACT US MANAGEMENT
  getContactUs: `${url}/user/getContactUs`,
  viewContactsUs: `${url}/user/viewContactsUs`,
  replyContactUs: `${url}/admin/replyContactUs`,

  //leaderBoard
  getLeaderBoard: `${url}/user/getLeaderBoard`,

  //LEVEL & MULTILEVEL MANAGEMENT
  getLevelPrize: `${url}/admin/getLevelPrize`,
  editLevelPrize: `${url}/admin/editLevelPrize`,

  //SUBADMIN MANAGEMENT
  addSubAdmin: `${url}/admin/addSubAdmin`,
  listSubAdmin: `${url}/admin/listSubAdmin`,
  editProfileSubAdmin: `${url}/admin/editProfileSubAdmin`,
  deleteSubAdmin: `${url}/admin/deleteSubAdmin`,
  blockUnblockSubAdmin: `${url}/admin/blockUnblockSubAdmin`,
  // graph analytics
  graphForUser: `${url}/admin/graphForUser`,
  graphGameHistory: `${url}/admin/graphGameHistory`,
  userRegistration: `${url}/admin/userRegistration`,
  userGameList: `${url}/game/userGameList`,
};
export default ApiConfig;
