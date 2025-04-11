/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import styles from "../pages/styles/Homepage.module.scss";
import {
  getCategories,
  getPerformanceByCategory,
  toggleVotePermit,
  votePerformance,
} from "../services/userService";
import socket from "../socket/socket";
import { setPerformances, updateVote } from "../store/slices/performanceSlice";
import { logout, selectIsAuthenticated } from "../store/slices/userSlice";
import { Category } from "../types/Category";
import {
  selectVotingEnabledByCategory,
  setVotingState,
} from "../store/slices/categorySlice";

// Danh sách màu sắc khác nhau cho từng performance
const colors = ["#ff4d4f", "#40a9ff", "#36cfc9", "#ffec3d", "#9254de"];

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const performances = useSelector(
    (state: any) => state.performance.performances
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);

  const handleLogout = () => {
    dispatch(logout());
  };

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      const data = res.data.data;
      setCategories(data);
      setCategoryId(data[0].id);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  }, []);

  const isVotingEnabled = useSelector((state: any) =>
    selectVotingEnabledByCategory(state, categoryId ?? -1)
  );

  const fetchPerformances = useCallback(async () => {
    if (categoryId === null) return;
    try {
      const res = await getPerformanceByCategory(categoryId);
      const data = res.data.data;
      dispatch(setPerformances(data));
    } catch (error) {
      console.error("Error fetching performances:", error);
    }
  }, [categoryId, dispatch]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (categoryId !== null) {
      fetchPerformances();
    }
  }, [categoryId, fetchPerformances]);

  // Lắng nghe sự kiện từ WebSocket
  useEffect(() => {
    socket.on("voteUpdate", (data) => {
      dispatch(updateVote(data));
    });

    socket.on("votingStateChanged", (data) => {
      dispatch(setVotingState(data));
    });

    return () => {
      socket.off("voteUpdate");
      socket.off("votingStateChanged");
    };
  }, [dispatch]);

  const handleSelect = (id: string) => {
    setSelectedId((prevSelectedId) => (prevSelectedId === id ? null : id));
  };

  const handleVote = async () => {
    if (!selectedId || !isVotingEnabled) {
      return;
    }
    try {
      const payload = {
        categoryId: categoryId!,
      };
      await votePerformance(selectedId, payload);

      // Cập nhật lại tổng số lượng vote
      const updatedPerformances = performances.map((performance: any) =>
        performance.id === selectedId
          ? { ...performance, vote: performance.vote + 1 }
          : performance
      );

      // Cập nhật lại các tiết mục trong state
      dispatch(setPerformances(updatedPerformances));
    } catch (error) {
      console.error("Voting failed", error);
    }
  };

  const handleVotePermission = async () => {
    if (!categoryId) return;

    try {
      const newEnabled = !isVotingEnabled;
      await toggleVotePermit(categoryId.toString(), { enabled: newEnabled });

      dispatch(
        setVotingState({ id: categoryId.toString(), enabled: newEnabled })
      );
    } catch (error) {
      console.error("Failed to toggle voting state", error);
    }
  };

  return (
    <div style={{ padding: "40px" }}>
      <div className={styles.headerSection}>
        <h1 style={{ margin: 0, fontSize: "24px" }}>Voting Results</h1>
        <div>
          {isAuthenticated ? (
            <div className={styles.userWelcome}>
              <Button
                type="primary"
                onClick={handleVotePermission}
                className={`${styles.buttonCustom} ${
                  isVotingEnabled
                    ? styles.stopVotingButton
                    : styles.enableVotingButton
                }`}
                style={{ marginRight: "10px" }}
              >
                {isVotingEnabled ? "Stop Voting" : "Enable Voting"}
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleLogout}
                className={styles.buttonCustom}
              >
                Logout
              </Button>
            </div>
          ) : (
            <Button
              type="primary"
              onClick={() => navigate("/login")}
              className={`${styles.buttonCustom} ${styles.loginButton}`}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      {/* Phần danh sách tiết mục */}
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {performances.map((performance: any, index: number) => {
          const totalVotes = performances.reduce(
            (acc: number, p: any) => acc + p.vote,
            0
          );
          const percentage =
            totalVotes > 0 ? (performance.vote / totalVotes) * 100 : 0;

          return (
            <div
              key={performance.id}
              style={{
                marginBottom: "20px",
                cursor: "pointer",
              }}
              onClick={() => handleSelect(performance.id)}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  border:
                    selectedId === performance.id
                      ? "1px solid #1890ff"
                      : "none",
                  borderRadius: 30,
                  padding: 10,
                }}
              >
                <div style={{ width: "100px", fontWeight: "bold" }}>
                  {performance.name}
                </div>
                <div
                  style={{
                    flex: 1,
                    height: "30px",
                    position: "relative",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      left: 0,
                      top: 0,
                      height: "100%",
                      width: `${percentage}%`,
                      backgroundColor: colors[index % colors.length],
                      borderRadius: "4px",
                      transition: "width 0.3s ease",
                      border:
                        selectedId === performance.id
                          ? "2px solid #1890ff"
                          : "none",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: percentage > 50 ? "#fff" : "#000",
                      fontWeight: "bold",
                      zIndex: 1,
                    }}
                  >
                    {`${Math.round(percentage)}% (${performance.vote} votes)`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Categories section */}
      <Row
        gutter={[16, 16]}
        style={{ marginTop: 40, justifyContent: "center" }}
      >
        {categories.map((category: any) => (
          <Col key={category.id}>
            <Button
              className={styles.buttonCustom}
              type={category.id === categoryId ? "primary" : "default"}
              style={{
                color: category.id === categoryId ? "#fff" : "#000",
                backgroundColor:
                  category.id === categoryId ? "#1890ff" : "#d9d9d9",
              }}
              onClick={() => setCategoryId(category.id)}
            >
              {category.categoryName}
            </Button>
          </Col>
        ))}
      </Row>

      {/* Vote button */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
        }}
      >
        <Button
          className={styles.buttonCustom}
          type="primary"
          onClick={handleVote}
          disabled={!selectedId || !isVotingEnabled}
          size="large"
        >
          {!isVotingEnabled ? "Voting is currently disabled" : "Vote"}
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
