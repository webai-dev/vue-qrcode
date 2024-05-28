import type {
  NavigationGuard,
  RouteLocationNormalizedLoaded,
  RouteRecordRaw,
} from "vue-router"

/* Website */
// not in usage right now
// import WebsitePage from "~/pages/landing-page/index.vue"

/* Auth */
import AuthIndex from "~/pages/login/index.vue"
import LoginPage from "~/pages/login/LoginPage.vue"
import RegisterPage from "~/pages/signup/index.vue"
import ForgotPasswordPage from "~/pages/forgot-password/index.vue"
import ForgotPasswordConfirmPage from "~/pages/forgot-password/forgotPasswordConfirmation.vue"
import ConfirmPage from "~/pages/verification-code/index.vue"
import SetPasswordPage from "~/pages/set-password/index.vue"
import LoadingPrompt from "~/pages/loading-prompt/index.vue"

/* Application */
import AppIndex from "~/pages/index.vue"

import WelcomePage from "~/pages/welcome/index.vue"

import DashboardPage from "~/pages/dashboard/index.vue"

import CustomerPage from "~/pages/customers/index.vue"
import CustomerDetailPage from "~/pages/customers/CustomerDetails.vue"
import CustomerContact from "~/pages/customers/tab-views/CustomerContact.vue"
import CustomerUserList from "~/pages/customers/tab-views/CustomerUserList.vue"

import WindowshopPage from "~/pages/window-shop/index.vue"
import ManageWindowShops from "~/pages/window-shop/ManageWindowShops.vue"
import ShopDetailPage from "~/pages/window-shop/ShopDetailPage.vue"

import GeneratorPage from "~/pages/generator/index.vue"
import GeneratorsOverview from "~/pages/generator/GeneratorsOverview.vue"
import GeneratorEditProjectPage from "~/pages/generator/GeneratorEditProjectPage.vue"

import GeneratorFinalizePage from "~/pages/generator/GeneratorFinalizePage.vue"

import GeneratorCreateUrlsPage from "~/pages/generator/urls/GeneratorCreateUrlsPage.vue"
import GeneratorChooseUrl from "~/pages/generator/urls/GeneratorChooseUrl.vue"
import GeneratorShortUrl from "~/pages/generator/urls/GeneratorShortUrl.vue"
import GeneratorUrlAmount from "~/pages/generator/urls/GeneratorUrlAmount.vue"

import GeneratorCreateQrsPage from "~/pages/generator/qrs/GeneratorCreateQrsPage.vue"
import GeneratorSingleVsMultiple from "~/pages/generator/qrs/GenerarorSingleVsMultiple.vue"
import GeneratorCreateSingleQrPage from "~/pages/generator/qrs/GeneratorCreateSingleQrPage.vue"
import GeneratorSingleQrSuccessPage from "~/pages/generator/qrs/GeneratorSingleQrSuccess.vue"
import GeneratorQrAmount from "~/pages/generator/qrs/GeneratorQrAmount.vue"

import UsersPage from "~/pages/users/index.vue"
import UserDetailPage from "~/pages/users/UserDetails.vue"

import SettingsPage from "~/pages/settings/index.vue"
import ApiKeysPage from "~/components/shared/ApiKeysList.vue"
import MyAccountPage from "~/pages/settings/MyAccount.vue"
import UrlSettingsPage from "~/components/shared/UrlSettings.vue"
import TermsOfUsePage from "~/pages/settings/TermsOfUsePage.vue"

/* Utilities */
import NotFoundPage from "~/pages/404/index.vue"
import { useSessionStore } from "~/stores/session"

/* Permissions */
import { Role, allSignedInRoles } from "~/constants/permissions"
import type { IUserRole } from "~/types/stores/Session"
import { labelsRoutes } from "~/router/labels.routes"

const indexBeforeEnterHook: NavigationGuard = async () => {
  const sessionStore = useSessionStore()
  if (!sessionStore.isCurrentUserFetched) {
    await sessionStore.loadCurrentUser(false)
  }
  if (sessionStore.getCurrentUser?.id) {
    return { name: "app.generator" }
  }
}

const generatorApp = {
  name: "app.generator",
  path: "/app/generator",
  component: GeneratorPage,
  meta: {
    role: [Role.CustomerAdmin, Role.UserView, Role.UserEdit, Role.Developer],
  },
  children: [
    {
      name: "app.generator.overview",
      path: "",
      component: GeneratorsOverview,
    },
    {
      name: "app.generator.edit.project",
      path: "edit/project/:projectId",
      component: GeneratorEditProjectPage,
    },
    {
      name: "app.generator.processing",
      path: ":projectId/:setId/:type/export", // type = id, url or qr
      component: GeneratorFinalizePage,
    },
    {
      name: "app.generator.create.urls",
      path: "create/:projectId/urls",
      component: GeneratorCreateUrlsPage,
      children: [
        {
          name: "app.generator.create.urls.index",
          path: "",
          component: GeneratorChooseUrl,
          props: {
            nextUrl: (route: RouteLocationNormalizedLoaded) =>
              `/app/generator/create/${route.params.projectId}/urls/short`,
          },
        },
        {
          name: "app.generator.create.urls.short",
          path: "short",
          component: GeneratorShortUrl,
          props: {
            nextUrl:
              (route: RouteLocationNormalizedLoaded) =>
              (hasSettings: boolean) =>
                hasSettings
                  ? `/app/generator/create/${route.params.projectId}/urls/amount`
                  : `/app/generator/create/${route.params.projectId}/urls/ids`,
          },
        },
        {
          name: "app.generator.create.urls.amount",
          path: "amount",
          component: GeneratorUrlAmount,
        },
      ],
    },
    {
      name: "app.generator.create.qrs",
      path: "create/:projectId?/qrs",
      component: GeneratorCreateQrsPage,
      children: [
        {
          name: "app.generator.create.qrs.index",
          path: "",
          component: GeneratorSingleVsMultiple,
        },
        {
          name: "app.generator.create.qrs.single",
          path: "single",
          component: GeneratorCreateSingleQrPage,
        },
        {
          name: "app.generator.create.qrs.multiple",
          path: "multiple",
          component: GeneratorChooseUrl,
          props: {
            nextUrl: (route: RouteLocationNormalizedLoaded) =>
              `/app/generator/create/${route.params.projectId}/qrs/multiple/short`,
          },
        },
        {
          name: "app.generator.create.qrs.multiple.short",
          path: "multiple/short",
          component: GeneratorShortUrl,
          props: {
            nextUrl:
              (route: RouteLocationNormalizedLoaded) =>
              (hasSettings: boolean) =>
                hasSettings
                  ? `/app/generator/create/${route.params.projectId}/qrs/multiple/amount`
                  : `/app/generator/create/${route.params.projectId}/qrs/multiple/ids`,
          },
        },
        {
          name: "app.generator.create.qrs.multiple.amount",
          path: "multiple/amount",
          component: GeneratorQrAmount,
        },
      ],
    },
    {
      name: "app.generator.process.singleQr",
      path: "single/:singleQrId/export",
      component: GeneratorSingleQrSuccessPage,
    },
  ],
  redirect: { name: "app.generator.overview" },
}

const routes: RouteRecordRaw[] = [
  {
    name: "index",
    path: "/",
    redirect: { name: "auth.login" },
  },
  {
    name: "auth",
    path: "/",
    beforeEnter: indexBeforeEnterHook,
    component: AuthIndex,
    children: [
      {
        name: "auth.login",
        path: "login",
        component: LoginPage,
      },
      {
        name: "auth.register",
        path: "register",
        component: RegisterPage,
      },
      {
        name: "auth.forgotPassword",
        path: "forgot-password",
        component: ForgotPasswordPage,
      },
      {
        name: "auth.forgotPasswordConfirm",
        path: "forgot-password-confirm",
        component: ForgotPasswordConfirmPage,
      },
      {
        name: "auth.confirm",
        path: "confirm",
        component: ConfirmPage,
      },
      {
        name: "auth.setPassword",
        path: "set-password",
        component: SetPasswordPage,
      },
    ],
  },
  {
    name: "loading",
    path: "/loading",
    component: LoadingPrompt,
  },
  {
    name: "app",
    path: "/",
    component: AppIndex,
    meta: {
      role: allSignedInRoles as IUserRole[],
    },
    children: [
      labelsRoutes,
      {
        name: "welcome",
        path: "/welcome",
        component: WelcomePage,
        meta: {
          role: allSignedInRoles as IUserRole[],
        },
      },
      {
        name: "app.dashboard",
        path: "/app/dashboard",
        component: DashboardPage,
        meta: {
          role: allSignedInRoles as IUserRole[],
        },
      },
      {
        name: "app.customers",
        path: "/app/customers",
        component: CustomerPage,
        meta: {
          role: [Role.SuperAdmin],
        },
      },
      {
        name: "users",
        path: "/app/users",
        component: UsersPage,
        meta: {
          role: [Role.SuperAdmin, Role.CustomerAdmin],
        },
      },
      {
        name: "app.userdetails",
        path: "/app/user/:userId",
        component: UserDetailPage,
        meta: {
          role: [Role.SuperAdmin],
        },
      },
      {
        name: "app.customerDetails",
        path: "/app/customer/:customerId",
        component: CustomerDetailPage,
        meta: {
          role: [Role.SuperAdmin],
        },
        children: [
          {
            name: "app.customerDetails.contact",
            path: "contact",
            component: CustomerContact,
            meta: {
              role: [Role.SuperAdmin],
            },
          },
          {
            name: "app.customerDetails.apiKeys",
            path: "api-keys",
            component: ApiKeysPage,
            meta: {
              role: [Role.SuperAdmin],
            },
          },
          {
            name: "app.customerDetails.users",
            path: "users",
            component: CustomerUserList,
            meta: {
              role: [Role.SuperAdmin],
            },
          },
        ],
      },
      {
        name: "app.touchpoint",
        path: "/app/touchpoint",
        component: WindowshopPage,
        meta: {
          role: [
            Role.CustomerAdmin,
            Role.UserView,
            Role.UserEdit,
            Role.Developer,
          ],
        },
        children: [
          {
            path: "",
            component: ManageWindowShops,
            meta: {
              role: [
                Role.CustomerAdmin,
                Role.UserView,
                Role.UserEdit,
                Role.Developer,
              ],
            },
          },
          {
            path: ":shopId",
            component: ShopDetailPage,
            meta: {
              role: [
                Role.CustomerAdmin,
                Role.UserView,
                Role.UserEdit,
                Role.Developer,
              ],
            },
          },
        ],
      },
      {
        name: "app.settings",
        path: "/app/settings",
        redirect: { name: "app.settings.myAccount" },
        component: SettingsPage,
        meta: {
          role: allSignedInRoles as IUserRole[],
        },
        children: [
          {
            name: "app.settings.myAccount",
            path: "my-account",
            component: MyAccountPage,
            meta: {
              role: allSignedInRoles as IUserRole[],
            },
          },
          {
            name: "app.settings.apiKeys",
            path: "api-keys",
            component: ApiKeysPage,
            meta: {
              role: [Role.CustomerAdmin, Role.Developer],
            },
          },
          {
            name: "app.settings.urlSettings",
            path: "urlSettings",
            component: UrlSettingsPage,
            meta: {
              role: allSignedInRoles as IUserRole[],
            },
          },
          {
            name: "app.settings.termsOfUse",
            path: "terms-of-use",
            component: TermsOfUsePage,
            meta: {
              role: allSignedInRoles as IUserRole[],
            },
          },
        ],
      },
      generatorApp as RouteRecordRaw,
    ],
  },
  {
    name: "notFound",
    path: "/404",
    component: NotFoundPage,
  },
  {
    name: "wrongRoute",
    path: "/:pathMatch(.*)*",
    component: NotFoundPage,
  },
]
export { routes }
