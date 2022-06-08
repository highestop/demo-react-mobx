import React from 'react'
import { createRoot } from 'react-dom/client'
import { action, makeAutoObservable, observable, configure } from 'mobx'
import { observer } from 'mobx-react-lite'

configure({ enforceActions: 'observed' })

interface User {
  id: number
  name: string
}

interface Canvas {
  selection: number[]
  users: User[]
}

class Store {
  constructor() {
    makeAutoObservable(this)
    this.canvas = makeAutoObservable({
      selection: [],
      users: [],
    })
    this.getUser()
    console.log('store initialized')
  }

  @observable canvas: Canvas

  @action select = (id: number) => {
    this.canvas.selection.push(id)
    console.log('user-1 selected')
  }

  @action private getUser = () => {
    setTimeout(() => {
      this.canvas.users.push({ id: 1, name: 'User-1' })
      console.log('user-1 added')
    }, 2000)
  }
}

const store = new Store()

const App = observer(function App() {
  console.log('root component rendered')
  return (
    <>
      <p>
        <button onClick={() => store.select(1)}>Select User 1</button>
      </p>
      <p>User Count: {store.canvas.users.length}</p>
      <p>
        User Names:{' '}
        {store.canvas.users.map((user) => (
          <User key={user.id} id={user.id} name={user.name}></User>
        ))}
      </p>
      <p>Selected Users: {store.canvas.selection.length}</p>
    </>
  )
})

const User = observer(({ id, name }: User) => {
  console.log('user component rendered', id, name)
  return (
    <>
      {name} ({id})
    </>
  )
})

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)

  root.render(
    <React.StrictMode>
      <App></App>
    </React.StrictMode>
  )
}
