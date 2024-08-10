
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function PublicRoute({ element }) {
  const { currentUser } = useSelector((state) => state.user);
  return currentUser ? <Navigate to="/" /> : element;
}

export default PublicRoute;
