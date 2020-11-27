import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [getHeadersObject, setHeadersObject] = useState(null);
  const [getProductsList, setProductsList] = useState(null);
  const [getSortedProducts, setSortedProducts] = useState(null);
  const txtFinder = useRef();

  useEffect(() => {
    getProducts()
      .then((response) => {
        if (response.status === 200 && response.data.products !== undefined) {
          setProductsList(response.data.products);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function getProducts() {
    try {
      return axios.get("http://localhost:8000/getProducts/v1");
      //return axios.get("http://localhost:8000/getProducts/v2");
    } catch (error) {
      console.error(error);
    }
  }

  function sortColumn(objData) {
    const { products } =
      getSortedProducts !== null ? getSortedProducts : getProductsList;
    let sortedProducts = [...products];
    sortedProducts.sort((a, b) => {
      if (a[objData.key] < b[objData.key]) {
        return objData.direction === "ascending" ? 1 : -1;
      }
      if (a[objData.key] > b[objData.key]) {
        return objData.direction === "ascending" ? -1 : 1;
      }
      return 0;
    });
    let objectsHeaderArray = getHeadersObject;
    for (let i = 0; i < objectsHeaderArray.length; i++) {
      if (objectsHeaderArray[i].key === objData.key) {
        objectsHeaderArray[i].direction === "ascending"
          ? (objectsHeaderArray[i].direction = "descending")
          : (objectsHeaderArray[i].direction = "ascending");
      } else {
        objectsHeaderArray[i].direction = "off";
      }
    }
    setHeadersObject(objectsHeaderArray);
    setSortedProducts({ products: sortedProducts });
  }

  function filterTable() {
    const { products } = getProductsList;
    let result = [];
    let include = false;
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < getHeadersObject.length; j++) {
        if (
          products[i][getHeadersObject[j].key]
            .toString()
            .toLowerCase()
            .trim()
            .includes(txtFinder.current.value.toLowerCase().trim())
        )
          include = true;
      }
      if (include) result.push(products[i]);
      include = false;
    }
    let objectsHeaderArray = getHeadersObject;
    for (let i = 0; i < objectsHeaderArray.length; i++) {
      objectsHeaderArray[i].direction = "off";
    }
    setHeadersObject(objectsHeaderArray);
    setSortedProducts({ products: result });
  }

  function renderProductsTable(objProducts) {
    if (objProducts.products !== undefined && objProducts.products.length > 0) {
      let headerKeys = Object.keys(objProducts.products[0]);
      let headerKeysArray = [];
      if (getSortedProducts === null && getHeadersObject === null) {
        for (let i = 0; i < headerKeys.length; i++) {
          let objKey = {
            key: headerKeys[i],
            direction: "off",
          };
          headerKeysArray.push(objKey);
        }
        setHeadersObject(headerKeysArray);
      }
      let jsxHeader = (
        <thead key={"thead"}>
          <tr key={"trheader"}>
            {headerKeys.map((key, index) => {
              let objData;
              let objectsHeaderArray =
                getHeadersObject === null ? headerKeysArray : getHeadersObject;
              for (let i = 0; i < objectsHeaderArray.length; i++) {
                if (objectsHeaderArray[i].key === key)
                  objData = objectsHeaderArray[i];
              }
              return (
                <th key={"thheader" + index}>
                  <div className="header">
                    <span>{key.toLocaleUpperCase().trim()}</span>
                    <span
                      className={objData.direction}
                      onClick={() => sortColumn(objData)}
                    ></span>
                  </div>
                </th>
              );
            })}
          </tr>
        </thead>
      );
      let jsxBody = (
        <tbody key={"tbody"}>
          {objProducts.products.map((product, index) => {
            return (
              <tr key={"trproduct" + index}>
                {headerKeys.map((key, index) => {
                  return (
                    <td key={"tdproduct" + index}>
                      {product[key].toString().trim()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      );
      return [jsxHeader, jsxBody];
    }
    return (
      <tbody>
        <tr>
          <td>No Data Found</td>
        </tr>
      </tbody>
    );
  }

  return (
    <div>
      <div id="divTitle">PRODUCT'S TABLE</div>
      {getProductsList !== null ? (
        <>
          <div id="divSearch">
            <span>Search:</span>
            &nbsp;
            <input type="text" ref={txtFinder} onChange={filterTable}></input>
          </div>
          <table id="tblProducts">
            {getSortedProducts !== null
              ? renderProductsTable(getSortedProducts)
              : renderProductsTable(getProductsList)}
          </table>
        </>
      ) : (
        <>&nbsp;</>
      )}
    </div>
  );
}

export default App;
