import React from 'react';
import ReactDOM from 'react-dom';

// Before: A Prop Drilling Example
/*
const UserAvatar = ({ user, size }) => (
  <img 
    className={`user-avatar ${size || ''}`}
    alt='user avatar'
    src={user.avatar}
  />
);

const UserStats = ({ user }) => (
  <div className='user-stats'>
    <div>
      <UserAvatar user={user} />
      {user.name}
    </div>
    <div className='stats'>
      <div>{user.followers} Followers</div>
      <div>Following {user.following}</div>
    </div>
  </div>
);

const Nav = ({ user }) => (
  <div className='nav'>
    <UserAvatar user={user} size='small' />
  </div>
);

const Content = () => (
  <div className='content'>main content here</div>
);

const SideBbar = ({ user }) => (
  <div className='sidebar'>
    <UserStats user={user} />
  </div>
);

const Body = ({ user }) => (
  <div className='body'>
    <SideBbar user={user} />
    <Content user={user} />
  </div>
);

class App extends React.Component {
  state = {
    user: {
      avatar: 'https://www.gravatar.com/avatar/5c3dd2d257ff0e14dbd2583485dbd44b',
      name: 'Dave',
      followers: 1234,
      following: 123
    }
  };

  render() {
    const { user } = this.state;

    return (
      <div className='app'>
        <Nav user={user} />
        <Body user={user} />
      </div>
    );
  }
}
*/

/**************************/

// The “Slots” Pattern (Using children prop)
/*
const UserAvatar = ({ user, size }) => (
  <img 
    className={`user-avatar ${size || ''}`}
    alt='user avatar'
    src={user.avatar}
  />
);

const UserStats = ({ user }) => (
  <div className='user-stats'>
    <div>
      <UserAvatar user={user} />
      {user.name}
    </div>
    <div className='stats'>
      <div>{user.followers} Followers</div>
      <div>Following {user.following}</div>
    </div>
  </div>
);

// Accept children and render it/them
const Nav = ({ children }) => (
  <div className='nav'>{children}</div>
);

const Content = () => (
  <div className='content'>main content here</div>
);

const Sidebar = ({ children }) => (
  <div className='sidebar'>{children}</div>
);

// Body needs a sidebar and content, but written this way,
// they can be ANYTHING
const Body = ({ sidebar, content }) => (
  <div className='body'>
    <Sidebar>{sidebar}</Sidebar>
    {content}
  </div>
);

class App extends React.Component {
  state = {
    user: {
      avatar: 'https://www.gravatar.com/avatar/5c3dd2d257ff0e14dbd2583485dbd44b',
      name: 'Dave',
      followers: 1234,
      following: 123
    }
  };

  render() {
    const { user } = this.state;

    return (
      <div className='app'>
        <Nav>
          <UserAvatar user={user} size='small' />
        </Nav>
        <Body 
          sidebar={<UserStats user={user}/>} 
          content={<Content />}
        />
      </div>
    );
  }
}
*/

/**************************/

// Using the React Context API

// First, we create a new context.
// createContext returns an object with 2 properties:
// { Provider, Consumer }

// We'll use the Provider and Consumer below,
// but rather than pull them out individually,
// we can store the whole object in a variable.
// As long as it's named with UpperCase, we can use
// its properties in JSX expressions.
const UserContext = React.createContext();

// Components that need the data can tap into the context
// by rendering the Consumer. It uses the "render props"
// pattern -- rendering a function as a child.
// The context Consumer expects its child to be a single function.
// This is called the “render props” pattern

const UserAvatar = ({ size }) => (
  <UserContext.Consumer>
    {user => (
      <img
        className={`user-avatar ${size || ''}`}
        alt='user avatar'
        src={user.avatar}
      />
    )}
  </UserContext.Consumer>
);

// Notice that we don't need the 'user' prop any more!
// The Consumer fetches the user fom context
const UserStats = () => (
  <UserContext.Consumer>
    {user => (
      <div className='user-stats'>
        <div>
          <UserAvatar user={user} />
          {user.name}
        </div>
        <div className='stats'>
          <div>{user.followers} Followers</div>
          <div>Following {user.following}</div>
        </div>
      </div>
    )}
  </UserContext.Consumer>
);

// The components that once had to launder the 'user' prop
// are now nice and simple

const Nav = () => (
  <div className='nav'>
    <UserAvatar size='small' />
  </div>
);

const Content = () => (
  <div className='content'>
    main content here
  </div>
);

const Sidebar = () => (
  <div className='sidebar'>
    <UserStats />
  </div>
);

const Body = () => (
  <div className='body'>
    <Sidebar />
    <Content />
  </div>
);

// Inside App, we make the context available
// using the Provider
class App extends React.Component {
  state = {
    user: {
      avatar: "https://www.gravatar.com/avatar/5c3dd2d257ff0e14dbd2583485dbd44b",
      name: 'Dave',
      followers: 1234,
      following: 123
    }
  };

  render() {
    return (
      <div className='app'>
        <UserContext.Provider value={this.state.user}>
          <Nav />
          <Body />
        </UserContext.Provider>
      </div>
    );
  }
}



/**************************/
// useContext


// Plain empty context
const RoomContext = React.createContext();

// A component whose sole jobe is to manage
// the state of the Room
function RoomStore({ children }) {
  const [isLit, setLit] = React.useState(false);

  const togglLight = () => {
    setLit(!isLit);
  };

  // Pass down the state and the onToggleLight action
  return (
    <RoomContext.Provider value={{isLit, onToggleLight: togglLight}} >
      {children}
    </RoomContext.Provider>
  );
}

// Receive the state of the light, and the function to
// toggle the light, from RoomContext
const Room = () => {
  const { isLit, onToggleLight } = React.useContext(RoomContext);

  return (
    <div className={`room ${isLit ? 'lit' : 'dark'}`}>
      The room is {isLit ? 'lit' : 'dark'}.
      <br />
      <button onClick={onToggleLight}>Flip</button>
    </div>
  );
};

const App = () => (
  <RoomStore>
    <div className='app'>
      <Room />
    </div> 
  </RoomStore>
  
);

// Wrap the whole app in the RoomStore
// (you could also do this inside `App`)
// ReactDOM.render(
//   <RoomStore>
//     <App />
//   </RoomStore>,
// document.getElementById('root')
// );

export default App;
