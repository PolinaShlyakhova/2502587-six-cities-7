import { Navigate } from 'react-router-dom';
import { AppRoute } from '../../const';

type PrivateRouteProps = {
  children: JSX.Element;
  isAuthorized: boolean;
};

function PrivateRoute({ children, isAuthorized }: PrivateRouteProps): JSX.Element {
  return isAuthorized ? children : <Navigate to={AppRoute.Login} />;
}

export default PrivateRoute;
