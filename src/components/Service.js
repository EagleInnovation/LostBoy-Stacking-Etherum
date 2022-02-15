import http from "./http-common";

// export default interface ITutorialData {
//     id?: any | null,
//     title: string,
//     description: string,
//     published?: boolean,
// }

// const getAll = () => {
//   return http.get("/tutorials");
// };

const get = (param) => {
  return http.post(param);
};

const post = (param,data) => {
   return http.post(param,data);
}

// const create = (data: ITutorialData) => {
//   return http.post("/tutorials", data);
// };

// const update = (id: any, data: ITutorialData) => {
//   return http.put(`/tutorials/${id}`, data);
// };

// const remove = (id: any) => {
//   return http.delete(`/tutorials/${id}`);
// };

// const removeAll = () => {
//   return http.delete(`/tutorials`);
// };

// const findByTitle = (title: string) => {
//   return http.get(`/tutorials?title=${title}`);
// };

const Services = {
//   getAll,
  get,
  post,
//   create,
//   update,
//   remove,
//   removeAll,
//   findByTitle,
};

export default Services;