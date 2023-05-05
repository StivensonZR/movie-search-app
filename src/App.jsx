import './App.css'
import { useMovies } from './hooks/useMovies'
import { Movies } from './components/Movies'
import { useState, useEffect, useCallback } from 'react'
import { debounce } from "debounce";

function useSearch() {
  const [search, updateSearch] = useState('');
  const [error, setError] = useState(null)
  const [namePeli, setNamePeli] = useState('')

  useEffect(() => {
    if (search === '') {
      setNamePeli('Ingresa el nombre de la pelicula')
      setError('No se puede buscar una pelicula sin ingresar su nombre')
      return
    }

    if (search.match(/^\d+$/)) {
      setNamePeli('')
      setError('No se puede buscar una pelicula con un numero')
      return
    }

    if (search.length < 3) {
      setNamePeli('')
      setError('La busqueda debe tener al menos 3 caracteres')
      return
    }

    setError(null)

  }, [search])

  return { search, updateSearch, error, namePeli }
}


function App() {

  const [sort, setSort] = useState(false)

  const { search, updateSearch, error, namePeli } = useSearch()
  const { movies, getMovies, loading } = useMovies({ search, sort })
 

  const debouncedGetMovies = useCallback(
    debounce(search => {
      getMovies({ search })
    }, 300)
    , [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedGetMovies(newSearch)
  }


  return (

    <div className='page'>

      <header>
        <h1>Buscador de peliculas</h1>
        {namePeli && <p>{namePeli}</p>}
        <form className='form' onSubmit={handleSubmit}>
          <input onChange={handleChange} value={search} name='query' placeholder='Avengers, Stars Wars, The Matrix...' />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>

    </div>
  )
}

export default App
