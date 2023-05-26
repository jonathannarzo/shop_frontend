import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Suspense, lazy, useState } from "react";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import RequireAuth from "./components/RequireAuth";
const Home = lazy(() => import("./Pages/Home"));
const Category = lazy(() => import("./Pages/Category"));
const Product = lazy(() => import("./Pages/Product"));
const Login = lazy(() => import("./Pages/Login"));
const Customers = lazy(() => import("./Pages/Customers"));
const NotFound = lazy(() => import("./Pages/NotFound"));
import Unauthorized from "./Pages/Unauthorized";
import PersistLogin from "./components/PersistLogin";

function App() {
    const [login, setLogin] = useState(true);
    return (
        <BrowserRouter>
            <ToastContainer
                position="top-center"
                autoClose={1000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
            <Header />

            <main className="container">
                <Routes>
                    <Route
                        index
                        element={
                            <Suspense fallback={<>...Loading...</>}>
                                <Home />
                            </Suspense>
                        }
                    />

                    <Route element={<PersistLogin />}>
                        <Route
                            element={<RequireAuth allowedRoles={["User"]} />}
                        >
                            <Route
                                path="category"
                                element={
                                    <Suspense fallback={<>...Loading...</>}>
                                        <Category />
                                    </Suspense>
                                }
                            />
                        </Route>
                        <Route
                            element={
                                <RequireAuth allowedRoles={["Administrator"]} />
                            }
                        >
                            <Route
                                path="product"
                                element={
                                    <Suspense fallback={<>...Loading...</>}>
                                        <Product />
                                    </Suspense>
                                }
                            />
                        </Route>
                    </Route>
                    <Route
                        path="customer"
                        element={
                            <Suspense fallback={<>...Loading...</>}>
                                <Customers />
                            </Suspense>
                        }
                    />
                    <Route
                        path="login"
                        element={
                            <Suspense fallback={<>...Loading...</>}>
                                <Login />
                            </Suspense>
                        }
                    />
                    <Route path="*" element={<NotFound />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default App;
