import Jumbotron from '../components/cards/Jumbotron.jsx'
import {useAuth} from "../context/auth.jsx";

export default function Home() {
  const [auth, setAuth] = useAuth();

  return (
    <div>
      <Jumbotron title="Hello"/>
      <pre>{JSON.stringify(auth, null,4)}</pre>
    </div>
  )
}
