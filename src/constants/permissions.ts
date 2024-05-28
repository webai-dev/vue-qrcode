/**
 * Do not use Roles in application logic.
 * usePermissionsStore is exception.
 */
export enum Role {
  Public = "__public",
  Open = "__open",
  SuperAdmin = "SuperAdmin",
  CustomerAdmin = "CustomerAdmin",
  UserView = "UserView",
  UserEdit = "UserEdit",
  Developer = "Developer",
}

export const allSignedInRoles = [
  Role.SuperAdmin,
  Role.CustomerAdmin,
  Role.UserView,
  Role.UserEdit,
  Role.Developer,
]

export enum Action {
  // global
  "GetHello" = "GetHello",
  "HealthStatusCheck" = "HealthStatusCheck",
  // authorizationes
  "GetAvailableRoles" = "GetAvailableRoles",
  // customer
  "CreateCustomer" = "CreateCustomer",
  "GetPaginatedCustomersList" = "GetPaginatedCustomersList",
  "GetOneCustomer" = "GetOneCustomer",
  "DeactivateOneCustomer" = "DeactivateOneCustomer",
  "ActivateOneCustomer" = "ActivateOneCustomer",
  "UpdateOneCustomer" = "UpdateOneCustomer",
  "InviteCustomerUsers" = "InviteCustomerUsers",
  "DeactivateCustomerUsers" = "DeactivateCustomerUsers",
  // user
  "UserRegister" = "UserRegister",
  "UserLogin" = "UserLogin",
  "UserLogout" = "UserLogout",
  "UserSessionRefresh" = "UserSessionRefresh",
  "ReSendUserConfirmationCodeRequest" = "ReSendUserConfirmationCodeRequest",
  "UserConfirmRequest" = "UserConfirmRequest",
  "UserForgotPasswordFlowRequest" = "UserForgotPasswordFlowRequest",
  "UserConfirmPassword" = "UserConfirmPassword",
  "UserAuthChallenge" = "UserAuthChallenge",
  "GetOneUser" = "GetOneUser",
  "GetPaginatedUserList" = "GetPaginatedUserList",
  "GetPaginatedCustomerUserList" = "GetPaginatedCustomerUserList",
  "DisableUser" = "DisableUser",
  "EnableUser" = "EnableUser",
  "UpdateUser" = "UpdateUser",
  // API keys
  "GenerateAPIKey" = "GenerateAPIKey",
  "VerifyAPIKey" = "VerifyAPIKey",
  "ListAPIKeys" = "ListAPIKeys",
  "DeleteAPIKey" = "DeleteAPIKey",
}

// badge
export const colorMap: { [role: string]: string } = {
  CustomerAdmin: "purple",
  UserView: "success",
  UserEdit: "error",
  Developer: "gray",
  SuperAdmin: "primary",
}

const rolesDisplayNames: { [key: string]: string } = {
  CustomerAdmin: "Admin",
  UserView: "Viewer",
  UserEdit: "Editor",
  Developer: "Developer",
  SuperAdmin: "Super Admin",
}

export const getRoleDisplayName = (role: string) =>
  rolesDisplayNames[role] || role

export const getRoleName = (role: string) =>
  Object.keys(rolesDisplayNames).filter(
    (key) => rolesDisplayNames[key] === role,
  )[0]

export const generatorAllowedRoles = [
  Role.CustomerAdmin,
  Role.UserView,
  Role.UserEdit,
  Role.Developer,
]

export const generatorEditAllowedRoles = [Role.CustomerAdmin, Role.UserEdit]

export const shopAllowedRoles = [
  Role.CustomerAdmin,
  Role.UserView,
  Role.UserEdit,
  Role.Developer,
]
