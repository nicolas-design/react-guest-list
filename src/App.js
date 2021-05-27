/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const guestList = [];
  const [hasGuestList, setHasGuestList] = useState(guestList);
  const [hasName, setHasName] = useState('');
  const [hasSurname, setHasSurname] = useState('');
  const [hasGuestAPI, setHasGuestAPI] = useState(null);
  const [showAll, setShowAll] = useState([]);
  const [selectValue, setSelectValue] = useState('allRadio');
  const [editing, setEditing] = useState();
  const [placeHolder, setPlaceHolder] = useState('');
  const [placeHolderSurname, setPlaceHolderSurname] = useState('');
  const [deadline, setDeadline] = useState(null);
  const baseUrl = 'http://localhost:5000';
  const [hasId, setHasId] = useState(1);
  const hasAttending = false;
  useEffect(() => {
    async function fetchGuestAPI() {
      const response = await fetch(`${baseUrl}/`);
      const allGuests = await response.json();
      setHasGuestAPI(allGuests);
    }
    fetchGuestAPI();
  }, []);

  async function addGuestAPI() {
    const response = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: hasName,
        lastName: hasSurname,
        attending: hasAttending,
      }),
    });
    const createdGuest = await response.json();
  }

  async function updateGuestAPI(attendingGu, id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attendingGu }),
    });
    const updatedGuest = await response.json();
  }

  async function deleteGuestAPI(id) {
    const response = await fetch(`${baseUrl}/${id}`, { method: 'DELETE' });
    const deletedGuest = await response.json();
  }

  useEffect(() => {
    function showGuests() {
      if (selectValue === 'allRadio') {
        const newList = [...hasGuestList];
        setShowAll(newList);
      } else if (selectValue === 'attendingRadio') {
        const newList2 = hasGuestList.filter(
          (guest) => guest.attending === true,
        );
        setShowAll(newList2);
      } else {
        const newList3 = hasGuestList.filter(
          (guest) => guest.attending === false,
        );
        setShowAll(newList3);
      }
    }
    showGuests();
  }, [selectValue, hasGuestList]);

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (hasGuestAPI == null) {
    return <>loading...</>;
  }

  return (
    <div className="App">
      <div class="labels">
        <label>
          <input
            placeHolder="Name"
            onChange={(event) => setHasName(event.currentTarget.value)}
          />
        </label>

        <label>
          <input
            placeHolder="Surname"
            onChange={(event) => setHasSurname(event.currentTarget.value)}
          />
        </label>
        <button
          onClick={() => {
            if (hasGuestList.name === '' && hasGuestList.surName === '') {
              setHasGuestList.name = hasName;
              setHasGuestList.surName = hasSurname;
              setHasGuestList.id = hasId;
              setHasGuestList.attending = hasAttending;
              addGuestAPI();
            } else {
              const newGuestList = [...hasGuestList];
              newGuestList.push({
                name: hasName,
                surName: hasSurname,
                attending: hasAttending,
                id: hasId,
              });
              setHasGuestList(newGuestList);
              addGuestAPI();
              setHasId(hasId + 1);
            }
          }}
        >
          Add
        </button>
      </div>
      <select onChange={(e) => setSelectValue(e.currentTarget.value)}>
        <option value="allRadio" name="guests" selected="selected">
          all
        </option>
        <option value="attendingRadio" name="guests">
          attending
        </option>
        <option value="notAttendingRadio" name="guests">
          not attending
        </option>
      </select>
      <div className="orderList">
        <h2>Guest List</h2>
        <ol className="listTable">
          {showAll.map((guest) => {
            return (
              <li
                key={guest.name}
                style={
                  guest.deadline != null &&
                  guest.attending === false &&
                  new Date(guest.deadline) <= new Date()
                    ? { color: 'black' }
                    : { color: 'white' }
                }
              >
                {editing === guest.id ? (
                  <>
                    <input
                      value={placeHolder}
                      onChange={(e) => setPlaceHolder(e.currentTarget.value)}
                    />
                    <input
                      value={placeHolderSurname}
                      onChange={(e) =>
                        setPlaceHolderSurname(e.currentTarget.value)
                      }
                    />
                    {guest.attending === false ? (
                      <input
                        type="date"
                        onChange={(e) => setDeadline(e.currentTarget.value)}
                      />
                    ) : null}
                    <button
                      onClick={() => {
                        const newGuest = hasGuestList.map((guest2) => {
                          if (guest2.id === guest.id) {
                            guest2.name = placeHolder;
                            guest2.surName = placeHolderSurname;
                            if (guest2.attending === false) {
                              guest2.deadline = deadline;
                            }
                          }
                          return guest2;
                        });
                        setDeadline(null);
                        setHasGuestList(newGuest);
                        setEditing(null);
                      }}
                    >
                      save
                    </button>
                  </>
                ) : (
                  <>
                    {guest.name} {guest.surName}{' '}
                    {guest.attending === true ? 'attending' : 'unknown'}{' '}
                    {guest.attending === false ? guest.deadline : null}{' '}
                    <button
                      onClick={() => {
                        setEditing(guest.id);
                        setPlaceHolder(guest.name);
                        setPlaceHolderSurname(guest.surName);
                      }}
                    >
                      edit
                    </button>
                    <button
                      onClick={() => {
                        const updtGstLst = hasGuestList.map((guest2) => {
                          if (
                            guest2.name == guest.name &&
                            guest2.surName == guest.surName
                          ) {
                            if (guest2.attending === hasAttending) {
                              guest2.attending = !hasAttending;
                              updateGuestAPI(!hasAttending, guest2.id);
                            } else {
                              guest2.attending = hasAttending;
                              updateGuestAPI(hasAttending, guest2.id);
                            }
                          }
                          return guest2;
                        });
                        setHasGuestList(updtGstLst);
                      }}
                    >
                      Attending
                    </button>
                    <button
                      className="delete"
                      onClick={() => {
                        // eslint-disable-next-line array-callback-return
                        hasGuestList.map((guest2) => {
                          if (guest2.id === guest.id) {
                            deleteGuestAPI(guest2.id);
                          }
                        });
                        const updatedGuestList = hasGuestList.filter(
                          (guest2) =>
                            guest2.name !== guest.name ||
                            guest2.surName !== guest.surName,
                        );
                        setHasGuestList(updatedGuestList);
                      }}
                    >
                      X
                    </button>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="deleteDiv">
        <button
          className="delete"
          onClick={() => {
            // eslint-disable-next-line array-callback-return
            hasGuestList.map((guest) => {
              deleteGuestAPI(guest.id);
            });
            setHasGuestList([]);
            setShowAll([]);
          }}
        >
          Delete all
        </button>
      </div>
    </div>
  );
}

export default App;
