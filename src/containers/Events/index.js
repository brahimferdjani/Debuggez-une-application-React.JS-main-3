import { useState } from "react";
import EventCard from "../../components/EventCard";
import Select from "../../components/Select";
import { useData } from "../../contexts/DataContext";
import Modal from "../Modal";
import ModalEvent from "../ModalEvent";

import "./style.css";

const PER_PAGE = 9;

const EventList = () => {
  const { data, error } = useData();
  const [type, setType] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const filteredEvents = (data?.events || [])
    // fix: filtre par categories
    .filter((event) => (!type ? true : event.type === type))
    .filter((event, index) => {
      if (
        ((currentPage - 1) * PER_PAGE <= event.index,
          index && PER_PAGE * currentPage > event.index,
          index)
      ) {
        return true;
      }
      return false;
    });
  const changeType = (evtType) => {
    setCurrentPage(1);
    setType(evtType);
  };
  const pageNumber = Math.floor((filteredEvents?.length || 0) / PER_PAGE) + 1;
  const typeList = new Set(data?.events.map((event) => event.type));
  return (
    <>
      {error && <div>An error occured</div>}
      {data === null ? (
        "loading"
      ) : (
        <>
          <h3 className="SelectTitle">Catégories</h3>
          <Select
            selection={Array.from(typeList)}
            onChange={(value) => (value ? changeType(value) : changeType(null))}
          />
          <div id="events" className="ListContainer">
            {
              filteredEvents.map((event) => {
                if (!event.id) { return null; }
                return (
                  <Modal
                    key={event.id}
                    Content={<ModalEvent event={event} />}
                  >
                    {({ setIsOpened }) => (
                      <EventCard
                        imageSrc={event.cover}
                        title={event.title}
                        date={new Date(event.date)}
                        onClick={() => setIsOpened(true)}
                        label={event.type}
                      />
                    )}
                  </Modal>
                );

              }
              )
            }

          </div>
          <div className="Pagination">
            {[...Array(pageNumber || 0)].map((_, n) => (
              // eslint-disable-next-line react/no-array-index-key
              <a key={n} href="#events" onClick={() => setCurrentPage(n + 1)}>
                {n + 1}
              </a>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default EventList;
