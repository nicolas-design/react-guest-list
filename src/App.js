/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/no-unused-vars */
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const guestList = [];
  const [loading, setLoading] = useState(true);
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
  const baseUrl = 'https://rest-guest-list-api.herokuapp.com';

  const hasAttending = false;


  useEffect(() => {
    async function fetchGuestAPI() {
      const response = await fetch(`${baseUrl}/`);
      const allGuests = await response.json();
      /* setHasGuestAPI(allGuests);

      setShowAll(allGuests);*/
      setHasGuestList(allGuests);
      setLoading(false);
      console.log(allGuests);
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

  async function updateGuestAPI(attendingGu, firstName, lastName, id) {
    const response = await fetch(`${baseUrl}/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: attendingGu, firstName: firstName, lastName: lastName }),
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
            if (hasGuestList.firstName === '' && hasGuestList.lastName === '') {
              setHasGuestList.firstName = hasName;
              setHasGuestList.lastName = hasSurname;
              setHasGuestList.id = 1;
              setHasGuestList.attending = hasAttending;
              addGuestAPI();
            } else {
              const newGuestList = [...hasGuestList];
              const idArr = newGuestList.map((guest)=>{
                return guest.id;
              })
              const idNew = JSON.stringify(Math.max(...idArr) +1);
              console.log(idNew);
              newGuestList.push({
                id: idNew,
                firstName: hasName,
                lastName: hasSurname,
                attending: hasAttending,

              });
              setHasGuestList(newGuestList);
              addGuestAPI();


              console.log(newGuestList);

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
          {loading == true? "loading...": ""}
          {showAll.map((guest) => {
            return (
              <li
                key={guest.id}
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
                            guest2.firstName = placeHolder;
                            guest2.lastName = placeHolderSurname;

                            if (guest2.attending === false) {
                              guest2.deadline = deadline;

                            }
                            updateGuestAPI(guest2.attending, guest2.firstName, guest2.lastName, guest2.id);
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
                    {guest.firstName} {guest.lastName}{' '}
                    {guest.attending === true ? 'attending' : 'unknown'}{' '}
                    {guest.attending === false ? guest.deadline : null}{' '}
                    <button
                      onClick={() => {
                        setEditing(guest.id);
                        setPlaceHolder(guest.firstName);
                        setPlaceHolderSurname(guest.lastName);
                      }}
                    >
                      edit
                    </button>
                    <button
                      onClick={() => {
                        const updtGstLst = hasGuestList.map((guest2) => {
                          if (
                            guest2.firstName == guest.firstName &&
                            guest2.lastName == guest.lastName
                          ) {
                            if (guest2.attending === hasAttending) {
                              guest2.attending = !hasAttending;
                              updateGuestAPI(!hasAttending, guest2.firstName, guest2.lastName, guest2.id);
                            } else {
                              guest2.attending = hasAttending;
                              updateGuestAPI(!hasAttending, guest2.firstName, guest2.lastName, guest2.id);
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
                            guest2.firstName !== guest.firstName ||
                            guest2.lastName !== guest.lastName,
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
