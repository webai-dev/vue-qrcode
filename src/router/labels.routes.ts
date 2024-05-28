import type { RouteRecordRaw } from "vue-router"
import { Role } from "~/constants/permissions"
import LabelsPage from "~/pages/generator/index.vue"
import LabelsAddMainPage from "~/pages/generator/add/index.vue"
import GeneratingInProcessPage from "~/pages/generator/GeneratingInProcessPage.vue"
import LabelsAddPage from "~/pages/generator/add/LabelsAddPage.vue"
import LabelsIdPartsAddPage from "~/pages/generator/ids/LabelsIdPartsAddPage.vue"
import GeneratorCreateUrlsPage from "~/pages/generator/urls/GeneratorCreateUrlsPage.vue"
import GeneratorCreateQrsPage from "~/pages/generator/qrs/GeneratorCreateQrsPage.vue"

export const LabelsRoutesNamespaces = {
  main: "app.labels",
  add: {
    main: "app.labels.add.main",
    ids: "app.labels.add.ids",
    links: "app.labels.add.links",
    qr: "app.labels.add.qr",
  },
  loading: {
    inProcess: "app.labels.in-process",
  },
}

export const labelsRoutes: RouteRecordRaw = {
  name: LabelsRoutesNamespaces.main,
  path: "/app/labels",
  component: LabelsPage,
  meta: {
    role: [Role.CustomerAdmin, Role.UserView, Role.UserEdit, Role.Developer],
  },
  children: [
    {
      name: "app.labels.add",
      path: "add",
      component: LabelsAddMainPage,
      children: [
        {
          name: LabelsRoutesNamespaces.add.main,
          path: "",
          component: LabelsAddPage,
        },
        {
          name: LabelsRoutesNamespaces.add.ids,
          path: "ids",
          component: LabelsIdPartsAddPage,
        },
        {
          name: LabelsRoutesNamespaces.add.links,
          path: "links",
          component: GeneratorCreateUrlsPage,
        },
        {
          name: LabelsRoutesNamespaces.add.qr,
          path: "qr",
          component: GeneratorCreateQrsPage,
        },
      ],
    },
    {
      name: LabelsRoutesNamespaces.loading.inProcess,
      path: "in-process",
      component: GeneratingInProcessPage,
    },
  ],
}
