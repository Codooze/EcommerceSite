//import { useContext } from "react";
//import { CategoriesContext } from "../../contexts/categories.context";
import CategoryPreviewComponent from "../../components/category-preview/category-preview.component";

//using redux
import { useSelector } from "react-redux";

export default function CategoriesPreview() {
  //const { categoriesMap } = useContext(CategoriesContext);
  const { categoriesMap } = useSelector((state) => state.cart);
  //TODO use cashing with swr or react-query to cache the data
  // //console.log(categoriesMap);
  //on this component we are going to map over the categoriesMap object and for each key we are going to render a CategoryPreviewComponent
  return (
    <>
      {Object.keys(categoriesMap).map((title) => (
        <CategoryPreviewComponent
          key={title}
          title={title}
          items={categoriesMap[title]}
        />
      ))}
    </>
  );
}
