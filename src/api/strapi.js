import axios from "axios";
import qs from "qs";

const base = axios.create({ baseURL: "https://roku-strapi.onrender.com/api" });

base.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("FULL ERROR:", err.response?.data || err);
    return Promise.reject(err);
  }
);

export const getPages = () => {
  const query = qs.stringify(
    {
      populate: {
        layout: true,
        tenant: true,
        page_blocks: {
          on: {
            "roku.horizontal-list": {
              populate: {
                feed: true,
                card_style: true,
              },
            },

            "roku.grid": {
              populate: {
                feed: true,
                card_style: true,
              },
            },

            "roku.curation": {
              populate: {
                feed: true,
              },
            },

            "roku.roku-player": {
              populate: {
                feed: true,
              },
            },

            "roku.login": {
              populate: {
                login_template_1: {
                  populate: {
                    input_box_style: true,
                    buttons_style: true,
                  },
                },
              },
            },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  return base.get(`/roku-screens?${query}`);
};

export const createPage = (payload) =>
  base.post("/roku-screens", { data: payload });

export const updatePage = (documentId, payload) =>
  base.put(`/roku-screens/${documentId}`, { data: payload });

export const deletePage  = (documentId)        => base.delete(`/roku-screens/${documentId}`);

export const getFeeds = () =>
  base.get("/feeds?populate=*&pagination[pageSize]=100&sort=updatedAt:desc");

export const updateFeed = (id, data) =>
  base.put(`/feeds/${id}`, { data });

export const createFeed = (data) =>
  base.post("/feeds", { data });

export const deleteFeed = (documentId) =>
  base.delete(`/feeds/${documentId}`);

export const getCardStyles = () =>
  base.get("/roku-card-styles?populate=*&pagination[pageSize]=100&sort=updatedAt:desc");

export const createCardStyle = (data) =>
  base.post("/roku-card-styles", { data });

export const updateCardStyle = (id, data) =>
  base.put(`/roku-card-styles/${id}`, { data });

export const deleteCardStyle = (documentId) =>
  base.delete(`/roku-card-styles/${documentId}`);

export const getLayouts = () =>
  base.get("/roku-layouts?populate[tenant]=*");

export const createLayout = (data) =>
  base.post("/roku-layouts", { data });

export const updateLayout = (id, data) =>
  base.put(`/roku-layouts/${id}`, { data });

export const getTenants = () =>
  base.get("/tenants?populate=*&pagination[pageSize]=100");

export const createTenant = (data) =>
  base.post("/tenants", { data });

export const updateTenant = (id, data) =>
  base.put(`/tenants/${id}`, { data });

export const getRokuMenus = () =>
  base.get("/roku-menus?populate=*&pagination[pageSize]=100");

export const createRokuMenu = (data) =>
  base.post("/roku-menus", { data });

export const updateRokuMenu = (id, data) =>
  base.put(`/roku-menus/${id}`, { data });

export const getFeedContexts = () =>
  base.get("/feed-contexts?populate=*&pagination[pageSize]=100");

export const createFeedContext = (data) =>
  base.post("/feed-contexts", { data });

export const updateFeedContext = (id, data) =>
  base.put(`/feed-contexts/${id}`, { data });

