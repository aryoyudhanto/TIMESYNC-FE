import { BsPlusSquare, BsTrash } from "react-icons/bs";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import axios from "axios";

import { CustomInput, TextArea } from "components/CustomInput";
import { FlexyCard, WrappingCard } from "components/Card";
import Layout from "components/Layout";

import { CreateInboxType, InboxIdType } from "utils/Type";

const Inbox = () => {
  const [inboxEm, setInboxEm] = useState<CreateInboxType[]>([]);
  const [inbox, setInbox] = useState<CreateInboxType[]>([]);
  const [inboxId, setInboxId] = useState<InboxIdType>({});
  const [addTitle, setAddtitle] = useState<string>("");
  const [addDesc, setAddDesc] = useState<string>("");
  const [addTo, setAddTo] = useState<string>("");
  const [cookie, setCookie] = useCookies();
  const navigate = useNavigate();

  const checkRole = cookie.role;
  const admin = checkRole == "admin";
  const employee = checkRole == "employee";

  useEffect(() => {
    getInbox();
    getInboxEm();
  }, []);

  function getInbox() {
    axios
      .get(`announcements`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((res) => {
        const { data } = res.data;
        setInbox(data);
      })
      .catch((err) => {});
  }
  function getInboxEm() {
    axios
      .get(`inbox`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((res) => {
        const { data } = res.data;
        setInboxEm(data);
      })
      .catch((err) => {});
  }

  function getInboxId(id: number) {
    axios
      .get(`announcements/${id}`, {
        headers: {
          Authorization: `Bearer ${cookie.token}`,
        },
      })
      .then((res) => {
        const { data } = res.data;
        setInboxId(data);
      })
      .catch((err) => {});
  }

  function addInbox() {
    axios
      .post(
        `announcements`,
        {
          to: addTo,
          announcement_title: addTitle,
          announcement_description: addDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${cookie.token}`,
          },
        }
      )
      .then((res) => {
        Swal.fire({
          title: "Success",
          text: "Success add inbox",
          showCancelButton: false,
          confirmButtonText: "Ok",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate(0);
            getInbox();
          }
        });
      })
      .catch((err) => {});
  }

  function onDelete(id: number) {
    Swal.fire({
      title: "Are you sure want to delete inbox?",
      // text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      confirmButtonText: "Yes",
      cancelButtonColor: "#d33",
      cancelButtonText: "No",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`announcements/${id}`, {
            headers: {
              Authorization: `Bearer ${cookie.token}`,
            },
          })
          .then((res) => {
            Swal.fire({
              position: "center",
              icon: "success",
              text: "Delete successfully",
              showConfirmButton: false,
              timer: 1500,
            });
            getInbox();
          })
          .catch((err) => {});
      }
    });
  }

  return (
    <Layout inboxSet="w-full bg-gradient-to-r from-white to-navy hover:text-white">
      <WrappingCard
        judul="Inbox"
        rightSide={
          admin && (
            <form onSubmit={addInbox}>
              <label id="btn-create-inbox" htmlFor="my-modal-1">
                <p className="text-sky font-medium duration-300 hover:cursor-pointer active:scale-90">
                  <BsPlusSquare size={35} />
                </p>
              </label>
              <input type="checkbox" id="my-modal-1" className="modal-toggle" />
              <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box border-2 border-sky flex flex-col justify-center text-sky">
                  <p className="mb-5 pb-2 text-xl border-b-2 font-medium">
                    Create Inbox
                  </p>
                  <div className="flex justify-center gap-5">
                    <div className="flex flex-col gap-5">
                      <p className="py-3">To:</p>
                      <p className="py-3">Title:</p>
                      <p className="py-3">Message:</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <CustomInput
                        id="input-inbox-receiver"
                        type="text"
                        placeholder="Type receiver's NIP"
                        className="input input-bordered input-md w-80 max-w-xs border-2 border-sky text-black"
                        onChange={(e) => setAddTo(e.target.value)}
                      />
                      <CustomInput
                        id="input-inbox-title"
                        type="text"
                        placeholder="Type message title"
                        className="input input-bordered input-md w-80 max-w-xs border-2 border-sky text-black"
                        onChange={(e) => setAddtitle(e.target.value)}
                      />
                      <TextArea
                        id="input-inbox-message"
                        placeholder="Type broadcast message"
                        className="input input-bordered input-sm h-40 w-80 max-w-xs border-2 border-sky text-black"
                        onChange={(e) => setAddDesc(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="modal-action">
                    <button
                      id="btn-inbox-submit"
                      type="submit"
                      className="w-24 text-sm text-center border-2 border-sky bg-sky rounded-xl py-1 text-gray-50 font-medium duration-300 hover:cursor-pointer  hover:bg-blue-900  active:scale-90"
                    >
                      Submit
                    </button>
                    <label
                      id="btn-inbox-cancel"
                      htmlFor="my-modal-1"
                      className="w-24 text-sm text-center border-2 border-sky rounded-xl py-1 text-sky font-medium duration-300 hover:cursor-pointer hover:bg-red-600 hover:text-white  active:scale-90"
                    >
                      Cancel
                    </label>
                  </div>
                </div>
              </div>
            </form>
          )
        }
      >
        {admin &&
          inbox.map((data) => (
            <div className="flex justify-center gap-4" key={data.id}>
              <FlexyCard parentSet="w-fit mx-0">
                <div
                  className="flex items-center gap-5"
                  id={`card-inbox-${data.id}-${data.id}`}
                >
                  <label
                    id={`btn-detail-${data.id}`}
                    htmlFor="my-modal-3"
                    onClick={() => getInboxId(data.id)}
                  >
                    <div className="flex justify-center w-full gap-5 duration-300 hover:cursor-pointer active:scale-95">
                      <div className="flex justify-center w-1/5">
                        <p className="text-black capitalize">
                          {new Date(`${data.created_at}`)
                            .toString()
                            .substring(3, 15)}
                        </p>
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-black capitalize font-extrabold">
                          {data.announcement_title}
                        </p>
                        <p className="w-[35rem]">
                          {data.announcement_description.substring(0, 60) +
                            "..."}
                        </p>
                      </div>
                    </div>
                  </label>
                  {admin && (
                    <p
                      className="text-sky hover:text-red-600 duration-300 hover:cursor-pointer active:scale-90"
                      id={`btn-delete-${data.id}`}
                    >
                      <BsTrash size={27} onClick={() => onDelete(data.id)} />
                    </p>
                  )}
                </div>
              </FlexyCard>

              <form>
                <input
                  type="checkbox"
                  id="my-modal-3"
                  className="modal-toggle"
                />
                <div className="modal modal-bottom sm:modal-middle">
                  <div className="modal-box border-2 border-sky flex flex-col justify-center ">
                    <p className="mb-5 pb-2 text-2xl border-b-2 font-bold text-black">
                      Detail Inbox
                    </p>
                    <div className="flex flex-col justify-center gap-5">
                      <div className="flex">
                        <p>
                          {new Date(`${inboxId.created_at}`)
                            .toString()
                            .substring(3, 15)}
                        </p>
                      </div>
                      <p className="font-extrabold">
                        {inboxId.announcement_title}
                      </p>
                      <p className="text-justify">
                        {inboxId.announcement_description}
                      </p>
                    </div>
                    <div className="modal-action">
                      <label
                        id={`btn-close-${data.id}`}
                        htmlFor="my-modal-3"
                        className="w-28 text-sm text-center border-2 border-sky rounded-xl py-1 text-sky font-medium duration-300 hover:cursor-pointer hover:bg-red-600 hover:text-white  active:scale-90"
                      >
                        Close
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ))}
        {employee &&
          inboxEm.map((data) => (
            <div
              className="flex justify-center gap-4"
              key={data.id}
              id={`card-inbox-${data.id}`}
            >
              <FlexyCard parentSet="w-fit mx-0">
                <div className="flex items-center">
                  <label
                    id={`btn-detail-${data.id}`}
                    htmlFor="my-modal-3"
                    onClick={() => getInboxId(data.id)}
                  >
                    <div className="flex justify-center w-full gap-5 duration-300 hover:cursor-pointer active:scale-95">
                      <div className="flex justify-center w-1/5">
                        <p className="text-black capitalize">
                          {data.created_at}
                        </p>
                      </div>
                      <div className="flex flex-col w-full">
                        <p className="text-black capitalize font-extrabold">
                          {data.announcement_title}
                        </p>
                        <p className="w-[35rem]">
                          {data.announcement_description.substring(0, 75) +
                            "..."}
                        </p>
                      </div>
                    </div>
                  </label>
                </div>
              </FlexyCard>

              <form>
                <input
                  type="checkbox"
                  id="my-modal-3"
                  className="modal-toggle"
                />
                <div className="modal modal-bottom sm:modal-middle">
                  <div className="modal-box border-2 border-sky flex flex-col justify-center ">
                    <p className="mb-5 pb-2 text-2xl border-b-2 font-bold text-black">
                      Detail Inbox
                    </p>
                    <div className="flex flex-col justify-center gap-5">
                      <div className="flex">
                        <p>{inboxId.created_at}</p>
                      </div>
                      <p className="font-extrabold">
                        {inboxId.announcement_title}
                      </p>
                      <p className="text-justify">
                        {inboxId.announcement_description}
                      </p>
                    </div>
                    <div className="modal-action">
                      <label
                        id={`btn-close-${data.id}`}
                        htmlFor="my-modal-3"
                        className="w-28 text-sm text-center border-2 border-sky rounded-xl py-1 text-sky font-medium duration-300 hover:cursor-pointer hover:bg-red-600 hover:text-white  active:scale-90"
                      >
                        Close
                      </label>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          ))}
      </WrappingCard>
    </Layout>
  );
};

export default Inbox;
