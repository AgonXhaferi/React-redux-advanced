import {useDispatch, useSelector} from 'react-redux';

import Cart from './components/Cart/Cart';
import Layout from './components/Layout/Layout';
import Products from './components/Shop/Products';
import {Fragment, useEffect} from "react";
import {uiActions} from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true

function App() {
    const dispatch = useDispatch()

    const showCart = useSelector((state) => state.ui.cartIsVisible);
    const cartState = useSelector(state => state.cart)
    const notificationStatus = useSelector(state => state.ui.notification)

    useEffect(() => {
        const sendCartData = async () => {
            dispatch(uiActions.showNotification({
                    status: 'pending',
                    title: 'Sending...',
                    message: 'Sending cart data!'
                })
            )

            const response = await fetch('https://react-http-bafed-default-rtdb.europe-west1.firebasedatabase.app/cart.json',
                {
                    method: 'PUT',
                    body: JSON.stringify(cartState)
                }
            )

            if (!response.ok)
                throw new Error('Sending cart data failed!')


            dispatch(uiActions.showNotification({
                    status: 'success',
                    title: 'Success',
                    message: 'Send cart data successfully!'
                })
            )
        }

        if (isInitial) {
            isInitial = false
            return
        }

        sendCartData().catch(err => {
            dispatch(uiActions.showNotification({
                status: 'error',
                title: 'Error',
                message: 'Sending cart data failed!'
            }))
        })

    }, [cartState, dispatch])

    return (
        <Fragment>
            {notificationStatus && <Notification
                status={notificationStatus.status}
                title={notificationStatus.title}
                message={notificationStatus.message}
            />}
            <Layout>
                {showCart && <Cart/>}
                <Products/>
            </Layout>
        </Fragment>
    );
}

export default App;
