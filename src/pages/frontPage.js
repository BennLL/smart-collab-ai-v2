import { Link } from 'react-router-dom';

function FrontPage() {
    return (
        <div className="bg-red-500 w-20 h-20">
            <h1>Welcome to the Front Page</h1>
            <button><Link to="/login">Get Started</Link></button>
        </div>
    );
}

export default FrontPage;