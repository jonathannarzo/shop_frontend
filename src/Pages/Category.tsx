import axios from "../api/axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { ChevronLeft, ChevronRight } from "react-feather";

const Category = () => {
    const categoryUrl = "Category/";
    const axiosPrivate = useAxiosPrivate();

    const [modalShow, setModalShow] = useState(false);
    const handleModalClose = () => setModalShow(false);
    const handleModalShow = () => setModalShow(true);
    const [modalTitle, setModalTitle] = useState("");

    // Id whicch is the primary key of the category
    const [Id, setId] = useState<number>(0);

    // form datas to be used in the category
    const [formData, setformData] = useState({
        Id: 0,
        CategoryName: "",
        Description: "",
    });

    // List of category data
    const [dataList, setDataList] = useState<any[]>([]);

    const [dataListPage, setDataListPage] = useState({
        pageIndex: 1,
        hasNextPage: true,
        hasPreviousPage: false,
        totalPages: 5,
    });

    useEffect(() => {
        getDataList();
    }, []);

    // method to get all categories
    const getDataList = async (pageNum = 1) => {
        var page = categoryUrl + "?pageNum=" + pageNum;

        try {
            const response = await axiosPrivate.get(page);

            setDataList(response.data.dataList);

            setDataListPage({
                pageIndex: response.data.pageIndex,
                hasNextPage: response.data.hasNextPage,
                hasPreviousPage: response.data.hasPreviousPage,
                totalPages: response.data.totalPages,
            });
        } catch (error) {
            console.log(error);
        }
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
    const handleCreate = (formData: {
        Id: number;
        CategoryName: string;
        Description: string;
    }) => {
        axios
            .post(categoryUrl, formData)
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
        setModalTitle("Edit Category");
        handleModalShow();

        // set the Id of the data to edit
        setId(Id);
        axios
            .get(categoryUrl + Id)
            .then((result) => {
                setformData({
                    Id: Id,
                    CategoryName: result.data.categoryName,
                    Description: result.data.description,
                });

                return true;
            })
            .catch((error) => {
                console.log(error);
                return false;
            });
    };

    // method to update a category
    const handleUpdate = (formData: {
        Id: number;
        CategoryName: string;
        Description: string;
    }) => {
        console.log(formData);
        axios
            .put(categoryUrl + Id, formData)
            .then(function (response) {
                toast.success("Category successfully updated!");
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
            .delete(categoryUrl + Id)
            .then(function (response) {
                toast.success("Category successfully deleted!");
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
            ["Id"]: 0,
            ["CategoryName"]: "",
            ["Description"]: "",
        });
    };

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Categories</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setId(0);
                                setModalTitle("Create Category");
                                resetForm();
                                handleModalShow();
                            }}
                        >
                            Create Category
                        </button>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Category</th>
                        <th>Decription</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.categoryName}</td>
                            <td>{item.description}</td>
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
                                            "Are tou sure to delete category (" +
                                                item.categoryName +
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
                            <td colSpan={4}>No record found.</td>
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
                                htmlFor="category"
                                className="col-sm-2 col-form-label"
                            >
                                Category
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="CategoryName"
                                    autoComplete="off"
                                    value={formData.CategoryName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="description"
                                className="col-sm-2 col-form-label"
                            >
                                Description
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Description"
                                    autoComplete="off"
                                    value={formData.Description}
                                    onChange={handleChange}
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

export default Category;
