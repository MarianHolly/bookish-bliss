const site = {
    name: "site",
    title: "Site",
    type: "document",
    fields: [
      {
        name: "name",
        title: "Name",
        type: "string",
      },
      {
        name: "images",
        title: "Slider",
        type: "array",
        of: [{ type: "image" }],
      },
     
    ],
  };
  
  export default site;
  