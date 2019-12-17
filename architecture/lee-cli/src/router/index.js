import Loadable from 'react-loadable'
import Loading from '@src/components/Loading'

const User = Loadable({
    loader: () =>
      import(/* webpackChunkName: "User" */ '../pages/User/index'),
    loading: Loading
  })

  const rootRoutes = [
    { path: '/', name: '', component: User },
  ]
  export default rootRoutes