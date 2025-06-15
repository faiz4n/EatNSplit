import { useState } from "react";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [friendsList, setFriendsList] = useState(initialFriends);
  return (
    <div>
      <header>Eat-N-Split 🍽️</header>

      <div className="app">
        <div className="sidebar">
          <FriendsList
            selected={selected}
            friendsList={friendsList}
            setSelected={setSelected}
          />
          {isFormOpen && (
            <FormAddFriend
              friendsList={friendsList}
              setFriends={setFriendsList}
              setIsFormOpen={setIsFormOpen}
            />
          )}

          <Button onClick={() => setIsFormOpen((show) => !show)}>
            {isFormOpen ? "Close" : "Add Friend"}
          </Button>
        </div>
        {selected && (
          <FormSplitBill
            selected={selected}
            setSelected={setSelected}
            friend={selected}
            friendsList={friendsList}
            setFriendsList={setFriendsList}
          />
        )}
      </div>
    </div>
  );
}

function FriendsList({ selected, setSelected, friendsList }) {
  const friends = friendsList;
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          selected={selected}
          setSelected={setSelected}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, selected, setSelected }) {
  function handleOnSelect() {
    selected?.id === friend.id ? setSelected(null) : setSelected(friend);
  }
  return (
    <li className={selected?.id === friend.id ? "selected" : ""}>
      <img src={friend.image} alt="" />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}
        </p>
      )}
      {friend.balance === 0 && <p>You and {friend.name} are even</p>}

      <Button onClick={handleOnSelect}>
        {selected?.id === friend.id ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function Button({ children, onClick }) {
  return (
    <button className="button" onClick={onClick}>
      {children}
    </button>
  );
}
function FormAddFriend({ setFriends, friendsList, setIsFormOpen }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name: name,
      image: `${image}?=${id}`,
      balance: 0,
    };

    setFriends([...friendsList, newFriend]);
    setIsFormOpen(false);
  }
  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <label>📷Image URL</label>
      <input
        type="text"
        value={image}
        onChange={(e) => setImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function FormSplitBill({ friend, friendsList, setFriendsList, setSelected }) {
  const [bill, setBill] = useState("");
  const [payer, setPayer] = useState("me");

  const [myExpense, setMyExpense] = useState(null);
  const friendExpense = Math.abs(bill - myExpense);

  function handleSplitBill(e) {
    e.preventDefault();

    setFriendsList(
      friendsList.map((list) => {
        if (list.id != friend.id) return list;

        if (payer === "me") {
          return { ...list, balance: bill - myExpense };
        } else {
          return { ...list, balance: myExpense - bill };
        }
      })
    );

    setSelected(null);
  }
  return (
    <form className="form-split-bill" onSubmit={handleSplitBill}>
      <h2>Split bill with {friend.name}</h2>

      <label>💰Bill Value</label>
      <input
        type="number"
        value={bill}
        onChange={(e) => setBill(Number(e.target.value))}
      />

      <label>🧍Your expense</label>
      <input
        type="number"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > bill ? myExpense : Number(e.target.value)
          )
        }
      />
      <label>🧑‍🤝‍🧑{friend.name}'s expense</label>
      <input type="number" disabled value={friendExpense} />
      <label>🤑Who's paying the bill?</label>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="me">You</option>
        <option value="friend">{friend.name}</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  );
}
