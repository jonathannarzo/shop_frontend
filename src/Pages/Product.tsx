import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "react-feather";
import { useLocation, useNavigate } from "react-router-dom";

const Product = () => {
    const categoryUrl = "Category/";
    const productsUrl = "Products/";
    const navigate = useNavigate();
    const location = useLocation();

    const axiosPrivate = useAxiosPrivate();

    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);
    const [modalTitle, setModalTitle] = useState("");

    // Id which is the primary key of the product
    const [Id, setId] = useState<number>(0);

    // form datas to be used in the producs
    const [formData, setformData] = useState({
        Id: 0,
        ProductName: "",
        UnitPrice: 0,
        Quantity: 0,
        Manufacturer: "",
        ExpiryDate: "",
        CategoryId: 0,
    });

    // List of products data
    const [dataList, setDataList] = useState<any[]>([]);
    const [categoryDataList, setCategoryDataList] = useState<any[]>([]);

    const [dataListPage, setDataListPage] = useState({
        pageIndex: 1,
        hasNextPage: true,
        hasPreviousPage: false,
        totalPages: 5,
    });

    useEffect(() => {
        getDataList();
        getCategoryDataList();
    }, []);

    // method to get all categories
    const getCategoryDataList = () => {
        axiosPrivate
            .get(categoryUrl)
            .then((result) => {
                setCategoryDataList(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // method to get all categories
    const getDataList = (pageNum = 1) => {
        var page = pageNum ? productsUrl + "?pageNum=" + pageNum : productsUrl;

        axiosPrivate
            .get(page)
            .then((result) => {
                setDataList(result.data.dataList);
                setDataListPage({
                    pageIndex: result.data.pageIndex,
                    hasNextPage: result.data.hasNextPage,
                    hasPreviousPage: result.data.hasPreviousPage,
                    totalPages: result.data.totalPages,
                });
            })
            .catch((error) => {
                console.log(error);
                navigate("/login", {
                    state: { from: location },
                    replace: true,
                });
            });
    };

    // method used in data list paging
    const handlePage = (pageIndex: number) => {
        getDataList(pageIndex);
    };

    // method to handle form inputs on change
    const handleChange = (e: { target: { name: any; value: any } }) =>
        setformData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));

    // method to create new category
    const handleCreate = (formData: any) => {
        console.log(formData);
        axios
            .post(productsUrl, formData)
            .then(function (response) {
                toast.success("Category successfully added!");
                getDataList();
                resetForm();
                return true;
            })
            .catch(function (error) {
                console.log(error);
                return false;
            });
    };

    // Show data of categories in the form field
    const handleEdit = (Id: number) => {
        setModalTitle("Edit Product");
        handleModalShow();

        // set the Id of the data to edit
        setId(Id);
        axios
            .get(productsUrl + Id)
            .then((result) => {
                setformData({
                    Id: result.data.id,
                    ProductName: result.data.productName,
                    UnitPrice: result.data.unitPrice,
                    Quantity: result.data.quantity,
                    Manufacturer: result.data.manufacturer,
                    ExpiryDate: format(
                        new Date(result.data.expiryDate),
                        "yyyy-MM-dd"
                    ),
                    CategoryId: result.data.categoryId,
                });

                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
    };

    // method to update a category
    const handleUpdate = (formData: any) => {
        console.log(formData);
        axios
            .put(productsUrl + Id, formData)
            .then(function (response) {
                toast.success("Product successfully updated!");
                getDataList();
                return true;
            })
            .catch(function (error) {
                console.log(error);
                return false;
            });
    };

    // handles the update and create of category
    const handleSubmit = (e: { preventDefault: () => void; target: any }) => {
        e.preventDefault();

        if (Id !== 0) {
            // if id not zero update the existing record
            formData.Id = Id;
            handleUpdate(formData);
        } else {
            // create new record if id is not assigned
            handleCreate(formData);
        }
    };

    const handeDelete = (Id: number) => {
        axios
            .delete(productsUrl + Id)
            .then(function (response) {
                toast.success("Product successfully deleted!");
                getDataList();
                return true;
            })
            .catch(function (error) {
                console.log(error);
                return false;
            });
    };

    // Clear all form fields
    const resetForm = () => {
        setformData({
            Id: 0,
            ProductName: "",
            UnitPrice: 0,
            Quantity: 0,
            Manufacturer: "",
            ExpiryDate: "",
            CategoryId: 0,
        });
    };
    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Products</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setId(0);
                                setModalTitle("Create Product");
                                resetForm();
                                handleModalShow();
                            }}
                        >
                            Create Product
                        </button>
                    </div>
                </div>
            </div>
            <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Product</th>
                        <th>Unit Price</th>
                        <th>Quantity</th>
                        <th>Manufacturer</th>
                        <th>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.productName}</td>
                            <td>{item.unitPrice}</td>
                            <td>{item.quantity}</td>
                            <td>{item.manufacturer}</td>
                            <td>{item.category.categoryName}</td>
                            <td>
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => handleEdit(item.id)}
                                >
                                    Edit
                                </button>
                                &nbsp;
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() =>
                                        window.confirm(
                                            "Are tou sure to delete product (" +
                                                item.productName +
                                                ")?"
                                        ) && handeDelete(item.id)
                                    }
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    {dataList.length < 1 && (
                        <tr>
                            <td colSpan={7}>No record found.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div className="btn-group me-2">
                <button
                    className={
                        dataListPage.hasPreviousPage
                            ? "btn btn-light btn-sm"
                            : "btn btn-light btn-sm disabled"
                    }
                    onClick={() => handlePage(dataListPage.pageIndex - 1)}
                >
                    <ChevronLeft />
                    Prev
                </button>
                <button
                    className={
                        dataListPage.hasNextPage
                            ? "btn btn-light btn-sm"
                            : "btn btn-light btn-sm disabled"
                    }
                    onClick={() => handlePage(dataListPage.pageIndex + 1)}
                >
                    Next
                    <ChevronRight />
                </button>
            </div>

            <Modal
                size="lg"
                show={modalShow}
                onHide={handleModalClose}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modalTitle}</Modal.Title>
                </Modal.Header>
                <form method="post" onSubmit={handleSubmit} id="categoryForm">
                    <Modal.Body>
                        <div className="mb-3 row">
                            <label
                                htmlFor="ProductName"
                                className="col-sm-2 col-form-label"
                            >
                                Product Name
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="ProductName"
                                    autoComplete="off"
                                    value={formData.ProductName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="UnitPrice"
                                className="col-sm-2 col-form-label"
                            >
                                Unit Price
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="UnitPrice"
                                    autoComplete="off"
                                    value={formData.UnitPrice}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="Quantity"
                                className="col-sm-2 col-form-label"
                            >
                                Quantity
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Quantity"
                                    autoComplete="off"
                                    value={formData.Quantity}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="Manufacturer"
                                className="col-sm-2 col-form-label"
                            >
                                Manufacturer
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Manufacturer"
                                    autoComplete="off"
                                    value={formData.Manufacturer}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="CategoryId"
                                className="col-sm-2 col-form-label"
                            >
                                Category
                            </label>
                            <div className="col-sm-10">
                                <select
                                    className="form-control"
                                    name="CategoryId"
                                    value={formData.CategoryId}
                                    onChange={handleChange}
                                >
                                    {categoryDataList.map((item, index) => (
                                        <option value={item.id} key={index}>
                                            {item.categoryName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="ExpiryDate"
                                className="col-sm-2 col-form-label"
                            >
                                Expiration Date
                            </label>
                            <div className="col-sm-10">
                                <input
                                    className="form-control"
                                    type="date"
                                    name="ExpiryDate"
                                    value={formData.ExpiryDate}
                                    onChange={handleChange}
                                    data-date-format="yy-mm-dd"
                                />
                            </div>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={handleModalClose}
                        >
                            Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </Modal.Footer>
                </form>
            </Modal>
        </>
    );
};

export default Product;
