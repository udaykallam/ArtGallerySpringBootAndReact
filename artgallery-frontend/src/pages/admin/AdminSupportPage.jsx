import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Headphones,
  Loader2,
  MessageCircle,
  RefreshCw,
  Send,
  Ticket,
  User,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import axiosClient from "../../api/axiosClient";
import "./AdminSupportPage.css";

const STATUS_OPTIONS = [
  "ALL",
  "OPEN",
  "IN_PROGRESS",
  "RESOLVED",
  "CLOSED",
];

const statusLabel = (status) => {
  switch (status) {
    case "IN_PROGRESS":
      return "In Progress";
    default:
      return (
        status?.charAt(0) +
          status?.slice(1).toLowerCase() || ""
      );
  }
};

const formatDate = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusIcon = (status) => {
  switch (status) {
    case "OPEN":
      return <Clock3 size={15} />;

    case "IN_PROGRESS":
      return <MessageCircle size={15} />;

    case "RESOLVED":
      return <CheckCircle2 size={15} />;

    case "CLOSED":
      return <XCircle size={15} />;

    default:
      return <Ticket size={15} />;
  }
};

const getInitials = (name) => {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState([]);

  const [selectedTicket, setSelectedTicket] =
    useState(null);

  const [activeStatus, setActiveStatus] =
    useState("ALL");

  const [reply, setReply] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [ticketLoading, setTicketLoading] =
    useState(false);

  const [sending, setSending] =
    useState(false);

  const [updatingStatus, setUpdatingStatus] =
    useState(false);

  // =====================================================
  // LOAD ALL TICKETS
  // =====================================================

  const loadTickets = async () => {
    try {
      setLoading(true);

      const response =
        await axiosClient.get(
          "/admin/support/tickets"
        );

      setTickets(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load support tickets:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to load support tickets"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTickets = useMemo(() => {
    if (activeStatus === "ALL") {
      return tickets;
    }

    return tickets.filter(
      (ticket) =>
        ticket.status === activeStatus
    );
  }, [tickets, activeStatus]);

  // =====================================================
  // COUNTS
  // =====================================================

  const counts = useMemo(() => {
    return {
      ALL: tickets.length,

      OPEN: tickets.filter(
        (ticket) =>
          ticket.status === "OPEN"
      ).length,

      IN_PROGRESS: tickets.filter(
        (ticket) =>
          ticket.status === "IN_PROGRESS"
      ).length,

      RESOLVED: tickets.filter(
        (ticket) =>
          ticket.status === "RESOLVED"
      ).length,

      CLOSED: tickets.filter(
        (ticket) =>
          ticket.status === "CLOSED"
      ).length,
    };
  }, [tickets]);

  // =====================================================
  // OPEN TICKET
  // =====================================================

  const openTicket = async (ticket) => {
    try {
      setTicketLoading(true);

      const response =
        await axiosClient.get(
          `/admin/support/tickets/${ticket.id}`
        );

      setSelectedTicket(response.data);
      setReply("");
    } catch (error) {
      console.error(
        "Failed to load ticket:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to open support ticket"
      );
    } finally {
      setTicketLoading(false);
    }
  };

  // =====================================================
  // SEND REPLY
  // =====================================================

  const sendReply = async () => {
    const message = reply.trim();

    if (!message) {
      toast.error("Please enter a reply");
      return;
    }

    if (!selectedTicket) {
      return;
    }

    try {
      setSending(true);

      await axiosClient.post(
        `/admin/support/tickets/${selectedTicket.id}/messages`,
        {
          message,
        }
      );

      toast.success("Reply sent");

      setReply("");

      // Reload the conversation
      const response =
        await axiosClient.get(
          `/admin/support/tickets/${selectedTicket.id}`
        );

      setSelectedTicket(response.data);

      // Update ticket in list
      await loadTickets();
    } catch (error) {
      console.error(
        "Failed to send reply:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to send reply"
      );
    } finally {
      setSending(false);
    }
  };

  // =====================================================
  // UPDATE STATUS
  // =====================================================

  const updateStatus = async (status) => {
    if (!selectedTicket) {
      return;
    }

    try {
      setUpdatingStatus(true);

      await axiosClient.put(
        `/admin/support/tickets/${selectedTicket.id}/status`,
        {
          status,
        }
      );

      toast.success(
        `Ticket marked ${statusLabel(status)}`
      );

      const response =
        await axiosClient.get(
          `/admin/support/tickets/${selectedTicket.id}`
        );

      setSelectedTicket(response.data);

      await loadTickets();
    } catch (error) {
      console.error(
        "Failed to update ticket status:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Failed to update ticket status"
      );
    } finally {
      setUpdatingStatus(false);
    }
  };

  // =====================================================
  // BACK
  // =====================================================

  const closeTicket = () => {
    setSelectedTicket(null);
    setReply("");
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="admin-support-page">
        <div className="admin-support-loading">
          <Loader2
            size={32}
            className="admin-support-spinner"
          />

          <p>
            Loading support requests...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // TICKET DETAIL
  // =====================================================

  if (selectedTicket) {
    return (
      <div className="admin-support-page">
        <div className="admin-support-container">

          <button
            className="admin-support-back"
            onClick={closeTicket}
          >
            <ArrowLeft size={17} />
            Back to Support Requests
          </button>

          <div className="admin-support-detail-header">

            <div>
              <div className="admin-support-eyebrow">
                Support Ticket #{selectedTicket.id}
              </div>

              <h1>
                {selectedTicket.subject}
              </h1>

              <div className="admin-support-ticket-meta">

                <span>
                  {selectedTicket.category}
                </span>

                {selectedTicket.orderId && (
                  <span>
                    Order #{selectedTicket.orderId}
                  </span>
                )}

                <span>
                  Created{" "}
                  {formatDate(
                    selectedTicket.createdAt
                  )}
                </span>

              </div>
            </div>

            <div
              className={`admin-support-status status-${selectedTicket.status?.toLowerCase()}`}
            >
              {getStatusIcon(
                selectedTicket.status
              )}

              {statusLabel(
                selectedTicket.status
              )}
            </div>

          </div>


          {/* CUSTOMER CARD */}

          <div className="admin-support-customer-card">

            <div className="admin-support-customer-avatar">
              {getInitials(
                selectedTicket.customerName
              )}
            </div>

            <div className="admin-support-customer-info">

              <span className="admin-support-customer-label">
                Customer
              </span>

              <strong>
                {selectedTicket.customerName ||
                  "Unknown Customer"}
              </strong>

              <span>
                {selectedTicket.customerEmail}
              </span>

            </div>

            <div className="admin-support-customer-id">
              Customer ID:{" "}
              {selectedTicket.customerId}
            </div>

          </div>


          {/* CONVERSATION */}

          <section className="admin-support-conversation">

            <div className="admin-support-section-heading">

              <div>
                <span className="admin-support-eyebrow">
                  Conversation
                </span>

                <h2>
                  Customer & Support
                </h2>
              </div>

              <span className="admin-support-message-count">
                {selectedTicket.messages?.length || 0}{" "}
                messages
              </span>

            </div>


            <div className="admin-support-messages">

              {ticketLoading ? (
                <div className="admin-support-message-loading">
                  <Loader2
                    size={25}
                    className="admin-support-spinner"
                  />

                  Loading conversation...
                </div>
              ) : selectedTicket.messages?.length ? (
                selectedTicket.messages.map(
                  (message) => {

                    const isAdmin =
                      message.senderRole ===
                      "ROLE_ADMIN";

                    return (
                      <div
                        key={message.id}
                        className={`admin-support-message ${
                          isAdmin
                            ? "message-admin"
                            : "message-customer"
                        }`}
                      >

                        <div className="admin-support-message-avatar">
                          {getInitials(
                            message.senderName
                          )}
                        </div>

                        <div className="admin-support-message-body">

                          <div className="admin-support-message-top">

                            <strong>
                              {message.senderName}
                            </strong>

                            <span>
                              {isAdmin
                                ? "Admin"
                                : "Customer"}
                            </span>

                            <time>
                              {formatDate(
                                message.createdAt
                              )}
                            </time>

                          </div>

                          <div className="admin-support-message-bubble">
                            {message.message}
                          </div>

                        </div>

                      </div>
                    );
                  }
                )
              ) : (
                <div className="admin-support-empty-conversation">
                  No messages in this ticket.
                </div>
              )}

            </div>


            {/* REPLY */}

            <div className="admin-support-reply">

              <div className="admin-support-reply-heading">

                <MessageCircle size={17} />

                <span>
                  Reply to customer
                </span>

              </div>

              <textarea
                value={reply}
                onChange={(event) =>
                  setReply(event.target.value)
                }
                placeholder="Write a professional response to the customer..."
                maxLength={5000}
                disabled={sending}
              />

              <div className="admin-support-reply-footer">

                <span>
                  {reply.length}/5000
                </span>

                <button
                  className="admin-support-send"
                  onClick={sendReply}
                  disabled={
                    sending ||
                    !reply.trim()
                  }
                >
                  {sending ? (
                    <>
                      <Loader2
                        size={16}
                        className="admin-support-spinner"
                      />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Reply
                    </>
                  )}
                </button>

              </div>

            </div>

          </section>


          {/* STATUS MANAGEMENT */}

          <section className="admin-support-management">

            <div>

              <span className="admin-support-eyebrow">
                Ticket Management
              </span>

              <h2>
                Update Status
              </h2>

              <p>
                Change the current state of this
                support request.
              </p>

            </div>


            <div className="admin-support-status-actions">

              {[
                "OPEN",
                "IN_PROGRESS",
                "RESOLVED",
                "CLOSED",
              ].map((status) => (

                <button
                  key={status}
                  className={`admin-support-status-button ${
                    selectedTicket.status === status
                      ? "active"
                      : ""
                  }`}
                  onClick={() =>
                    updateStatus(status)
                  }
                  disabled={updatingStatus}
                >
                  {getStatusIcon(status)}

                  {statusLabel(status)}
                </button>

              ))}

            </div>

          </section>

        </div>
      </div>
    );
  }

  // =====================================================
  // TICKET LIST
  // =====================================================

  return (
    <div className="admin-support-page">

      <div className="admin-support-container">

        {/* HEADER */}

        <header className="admin-support-header">

          <div>

            <div className="admin-support-eyebrow">
              Aurelian Gallery
            </div>

            <h1>
              Support Center
            </h1>

            <p>
              Manage customer support requests,
              conversations and resolutions.
            </p>

          </div>

          <button
            className="admin-support-refresh"
            onClick={loadTickets}
            title="Refresh tickets"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </header>


        {/* STATS */}

        <div className="admin-support-stats">

          <div className="admin-support-stat-card">
            <div className="admin-support-stat-icon">
              <Ticket size={20} />
            </div>

            <div>
              <span>Total Requests</span>
              <strong>{counts.ALL}</strong>
            </div>
          </div>


          <div className="admin-support-stat-card">
            <div className="admin-support-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Open</span>
              <strong>{counts.OPEN}</strong>
            </div>
          </div>


          <div className="admin-support-stat-card">
            <div className="admin-support-stat-icon">
              <MessageCircle size={20} />
            </div>

            <div>
              <span>In Progress</span>
              <strong>
                {counts.IN_PROGRESS}
              </strong>
            </div>
          </div>


          <div className="admin-support-stat-card">
            <div className="admin-support-stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Resolved</span>
              <strong>{counts.RESOLVED}</strong>
            </div>
          </div>

        </div>


        {/* FILTERS */}

        <div className="admin-support-filters">

          {STATUS_OPTIONS.map((status) => (

            <button
              key={status}
              className={
                activeStatus === status
                  ? "active"
                  : ""
              }
              onClick={() =>
                setActiveStatus(status)
              }
            >
              {status === "ALL"
                ? "All"
                : statusLabel(status)}

              <span>
                {counts[status]}
              </span>

            </button>

          ))}

        </div>


        {/* TICKETS */}

        <section className="admin-support-ticket-list">

          {filteredTickets.length === 0 ? (

            <div className="admin-support-no-tickets">

              <div className="admin-support-no-ticket-icon">
                <Headphones size={28} />
              </div>

              <h2>
                No support requests
              </h2>

              <p>
                There are no tickets matching
                this status.
              </p>

            </div>

          ) : (

            filteredTickets.map((ticket) => (

              <button
                key={ticket.id}
                className="admin-support-ticket-card"
                onClick={() =>
                  openTicket(ticket)
                }
              >

                <div className="admin-support-ticket-number">
                  #{ticket.id}
                </div>


                <div className="admin-support-ticket-main">

                  <div className="admin-support-ticket-title-row">

                    <h2>
                      {ticket.subject}
                    </h2>

                    <span
                      className={`admin-support-status status-${ticket.status?.toLowerCase()}`}
                    >
                      {getStatusIcon(
                        ticket.status
                      )}

                      {statusLabel(
                        ticket.status
                      )}
                    </span>

                  </div>


                  <div className="admin-support-ticket-details">

                    <span>
                      <User size={14} />

                      {ticket.customerName ||
                        "Unknown Customer"}
                    </span>

                    <span>
                      {ticket.customerEmail}
                    </span>

                    <span>
                      {ticket.category}
                    </span>

                    {ticket.orderId && (
                      <span>
                        Order #{ticket.orderId}
                      </span>
                    )}

                  </div>

                </div>


                <div className="admin-support-ticket-date">
                  {formatDate(
                    ticket.createdAt
                  )}
                </div>

              </button>

            ))

          )}

        </section>

      </div>

    </div>
  );
}