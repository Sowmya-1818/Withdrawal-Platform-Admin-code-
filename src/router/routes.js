import React, { lazy } from "react";
import { Redirect } from "react-router-dom";
import HomeLayout from "src/layouts/HomeLayout";
import LoginLayout from "src/layouts/LoginLayout";
import DashboardLayout from "src/layouts/DashboardLayout";

const routes = [
  {
    exact: true,
    path: "/",
    layout: LoginLayout,
    element: lazy(() => import("src/views/pages/Auth/Login")),
  },

  {
    guard: true,
    exact: true,
    path: "/dashboard",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Dashboard/Dash")),
  },
  {
    guard: true,
    exact: true,
    path: "/user-dashboard/:id",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Dashboard/UserDashboard")),
  },
  {
    guard: true,
    exact: true,
    path: "/analytics",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Analytics/Analytics")),
  },
  {
    guard: true,
    exact: true,
    path: "/analytics",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Analytics/Analytics")),
  },
  {
    guard: true,
    exact: true,
    path: "/announcement-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/AnouncementManagemnet/AnouncementManagement")
    ),
  },
  {
    guard: true,
    exact: true,
    path: "/add-announcement",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/AnouncementManagemnet/AddAnnouncement")
    ),
  },
  {
    guard: true,
    exact: true,
    path: "/banner-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/BannerManagement/BannerManagement")
    ),
  },
  {
    guard: true,
    exact: true,
    path: "/add-banner",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/BannerManagement/AddBanner")),
  },
  {
    guard: true,
    exact: true,
    path: "/profile",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Profile/Profile")),
  },
  {
    guard: true,
    exact: true,
    path: "/edit-profile",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Profile/EditProfile")),
  },
  {
    exact: true,
    guard: true,
    path: "/user-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/UserManagement/UserManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/blacklist-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/BlackListUser/BlackListUserManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/add-blacklist",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/BlackListUser/AddBlackListUser")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/category-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/CategoryManagement/CategoryManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/sub-admin-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/SubAdminManagement/SubAdminManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/add-sub-admin",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/SubAdminManagement/AddSubAdmin")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/add-category",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/CategoryManagement/AddCategory")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/view-category",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/CategoryManagement/ViewCategory")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/ticket-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/TicketManagement/TicketManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/add-ticket",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/TicketManagement/AddTicket")),
  },
  {
    exact: true,
    guard: true,
    path: "/add-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/CategoryManagement/AddCategory")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/game-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/GameManagement/GameManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/add-game",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/GameManagement/AddGame")),
  },
  {
    exact: true,
    guard: true,
    path: "/addtask",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Addtask/AddTask")),
  },
  {
    exact: true,
    guard: true,
    path: "/newaddtask",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Addtask/NewAddtasks")),
  },

  // tele ads
  {
    exact: true,
    guard: true,
    path: "/addteleads",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/TeleAds/AddTeleAds")),
  },
  {
    exact: true,
    guard: true,
    path: "/newteleads",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/TeleAds/NewTeleAds")),
  },
  // tele ads

  // MANAGE BONUS
  {
    exact: true,
    guard: true,
    path: "/addbonus",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/ManageBonus/AddBouns")),
  },
  // userhistories
  {
    exact: true,
    guard: true,
    path: "/userhistorys",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Userhistories/USerHistories")),
  },
  // Boosters
  {
    exact: true,
    guard: true,
    path: "/addboosters",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Boosters/AddBoosters")),
  },
  {
    exact: true,
    guard: true,
    path: "/newbooster",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Boosters/NewBooster")),
  },
  {
    exact: true,
    guard: true,
    path: "/boostertransaction",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Boosters/BoosterTransaction")),
  },
  {
    exact: true,
    guard: true,
    path: "/boostersettings",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Boosters/BoosterSettings")),
  },
  // Boosters

  // WithDrawals
 
  {
    exact: true,
    guard: true,
    path: "/allwithdrawals",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Withdrawals/AllWithdrawals")),
  },
  {
    exact: true,
    guard: true,
    path: "/addwithdrawmethod",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/AddWithdrawMethod")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/editwithdrawalmethod",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/EditWithdrawalMethod")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/pendingwithdrawals",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/PendingWithdrawals")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawals",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedWithdrawals")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalsstring",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedWithdrawalsstring")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalsstringsol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/Approvedwithdrawalstringsol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalssol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedSol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalsspin",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedWithdrawalsspin")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalsdrive",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedWithdrawalsdrive")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalsspinsol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/Approvedwithdrawalspinsol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalsdrivesol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedWithdrawalsdrivesol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/rejectedwithdrawals",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/RejectedWithdrawals")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawals",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawals")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalsstring",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalsstring")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalsspin",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalsspin")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalsdrive",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalsdrive")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalssol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalssol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalsstringsol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalsstringsol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalsspinsol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalsspinsol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalsdrivesol",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalsdrivesol")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/approvedwithdrawalstetris",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/ApprovedWithdrawalstetris")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/transferwithdrawalstetris",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/Withdrawals/TransferWithdrawalstetris")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/withdrawmethods",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Withdrawals/WithdrawMethods")),
  },
  // WithDrawals

  {
    exact: true,
    guard: true,
    path: "/add-user",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/UserManagement/AddUser")),
  },
  {
    exact: true,
    guard: true,
    path: "/edit-user",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/UserManagement/EditUser")),
  },
  {
    exact: true,
    guard: true,
    path: "/view-user",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/UserManagement/ViewUser")),
  },
  {
    exact: true,
    path: "/wallet-Management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/walletManagement/WalletManagement")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/wallet-transaction",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/walletManagement/WalletTransaction")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/deposit-transaction-detail",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/walletManagement/DepositTransuctionDetail")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/level-multiplier",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/labelMultiplier/LevelMultiplier")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/level-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/labelMultiplier/LevelManagement")
    ),
  },

  {
    exact: true,
    guard: true,
    path: "/static-content",
    layout: DashboardLayout,
    element: lazy(() =>
      import(
        "src/views/pages/StaticContentManagement/StaticContent/StaticContent"
      )
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/view-static",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/StaticContentManagement/StaticContent/ViewStatic")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/privacy-policy",
    layout: DashboardLayout,
    element: lazy(() =>
      import(
        "src/views/pages/StaticContentManagement/StaticContent/PrivacyPolicy"
      )
    ),
  },

  {
    exact: true,
    guard: true,
    path: "/faq-management",
    layout: DashboardLayout,
    element: lazy(() =>
      import(
        "src/views/pages/StaticContentManagement/FaqManagement/FaqManagement"
      )
    ),
  },

  {
    exact: true,
    guard: true,
    path: "/view-faq",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/StaticContentManagement/FaqManagement/ViewFaq")
    ),
  },
  {
    exact: true,
    guard: true,
    path: "/faq-edit",
    layout: DashboardLayout,
    element: lazy(() =>
      import("src/views/pages/StaticContentManagement/FaqManagement/FaqEdit")
    ),
  },

  {
    exact: true,
    guard: true,
    path: "/contact-management",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/ContactUS/ContactManagement")),
  },
  {
    exact: true,
    guard: true,
    path: "/view-contact",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/ContactUS/ViewContact")),
  },
  {
    exact: true,
    path: "/reset-password",
    layout: LoginLayout,
    element: lazy(() => import("src/views/pages/Auth/ResetPassword")),
  },
  {
    exact: true,
    path: "/forget-password",
    layout: LoginLayout,
    element: lazy(() => import("src/views/pages/Auth/Forget")),
  },
  {
    exact: true,
    guard: true,
    path: "/change-password",
    layout: DashboardLayout,
    element: lazy(() => import("src/views/pages/Auth/ChangePassword")),
  },
  {
    exact: true,
    path: "/verify-otp",
    layout: LoginLayout,
    element: lazy(() => import("src/views/pages/Auth/Verifyotp")),
  },
  {
    exact: true,
    path: "/404",
    element: lazy(() => import("src/views/errors/NotFound")),
  },
];

export default routes;
