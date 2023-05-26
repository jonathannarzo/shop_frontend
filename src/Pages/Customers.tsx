import { Modal } from "react-bootstrap";
import { ChevronLeft, ChevronRight } from "react-feather";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Customers = () => {
    const accountUrl = "Account/";
    const rolesUrl = "Roles/";
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
        Email: "",
        FirstName: "",
        LastName: "",
    });

    // List of category data
    const [dataList, setDataList] = useState<any[]>([]);

    // Paging
    const [dataListPage, setDataListPage] = useState({
        pageIndex: 1,
        hasNextPage: true,
        hasPreviousPage: false,
        totalPages: 5,
    });

    // List of roles
    const [rolesData, setRolesData] = useState<any[]>([]);

    useEffect(() => {
        getDataList();
        getRoles();
    }, []);

    // method to get all categories
    const getDataList = async (pageNum = 1) => {
        var page = accountUrl + "?pageNum=" + pageNum;

        try {
            const response = await axiosPrivate.get(page);

            setDataList(response.data);

            // setDataListPage({
            //     pageIndex: response.data.pageIndex,
            //     hasNextPage: response.data.hasNextPage,
            //     hasPreviousPage: response.data.hasPreviousPage,
            //     totalPages: response.data.totalPages,
            // });
        } catch (error) {
            console.log(error);
        }
    };

    const getRoles = async () => {
        try {
            const response = await axiosPrivate.get(rolesUrl);
            setRolesData(response.data);
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
        Email: string;
        FirstName: string;
        LastName: string;
    }) => {
        axios
            .post(accountUrl + "register", formData)
            .then(function (response) {
                toast.success("Customer successfully added!");
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
        setModalTitle("Edit Customer");
        handleModalShow();

        // set the Id of the data to edit
        setId(Id);
        axios
            .get(accountUrl + Id)
            .then((result) => {
                setformData({
                    Id: Id,
                    Email: result.data.email,
                    FirstName: result.data.firstName,
                    LastName: result.data.firstName,
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
        Email: string;
        FirstName: string;
        LastName: string;
    }) => {
        console.log(formData);
        axios
            .put(accountUrl + Id, formData)
            .then(function (response) {
                toast.success("Customer successfully updated!");
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
            .delete(accountUrl + Id)
            .then(function (response) {
                toast.success("Customer successfully deleted!");
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
            Email: "",
            FirstName: "",
            LastName: "",
        });
    };

    return (
        <>
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
                <h1 className="h2">Customers</h1>
                <div className="btn-toolbar mb-2 mb-md-0">
                    <div className="btn-group me-2">
                        <button
                            type="button"
                            className="btn btn-success"
                            onClick={() => {
                                setId(0);
                                setModalTitle("Add Customer");
                                resetForm();
                                handleModalShow();
                            }}
                        >
                            Add Customer
                        </button>
                    </div>
                </div>
            </div>

            <table className="table table-striped table-bordered table-hover table-sm">
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>FirstName</th>
                        <th>LastName</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dataList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.email}</td>
                            <td>{item.firstName}</td>
                            <td>{item.lastName}</td>
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
                                                item.firstName +
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
                                htmlFor="Email"
                                className="col-sm-2 col-form-label"
                            >
                                Email
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="Email"
                                    autoComplete="off"
                                    value={formData.Email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="FirstName"
                                className="col-sm-2 col-form-label"
                            >
                                FirstName
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="FirstName"
                                    autoComplete="off"
                                    value={formData.FirstName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="LastName"
                                className="col-sm-2 col-form-label"
                            >
                                LastName
                            </label>
                            <div className="col-sm-10">
                                <input
                                    type="text"
                                    className="form-control"
                                    name="LastName"
                                    autoComplete="off"
                                    value={formData.LastName}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                        <div className="mb-3 row">
                            <label
                                htmlFor="description"
                                className="col-sm-2 col-form-label"
                            >
                                Role
                            </label>
                            <div className="col-sm-10">
                                {rolesData.map((item, index) => (
                                    <div className="form-check" key={index}>
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id={"check" + index}
                                            value={item.name}
                                            name="roles[]"
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor={"check" + index}
                                        >
                                            {item.name}
                                        </label>
                                    </div>
                                ))}
                                {rolesData.length < 1 && "No record found"}
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

export default Customers;
