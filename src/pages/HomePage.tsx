/* eslint-disable @typescript-eslint/no-explicit-any */
import { Alert, Button, Col, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "../pages/styles/Homepage.module.scss";
import {
  getCategories,
  getPerformanceByCategory,
  getSettings,
  toggleVotePermit,
} from "../services/userService";
import socket from "../socket/socket";
import {
  selectVotingEnabledByCategory,
  setCategories,
  setVotingState,
} from "../store/slices/categorySlice";
import { setPerformances, updateVote } from "../store/slices/performanceSlice";
import { logout, selectIsAuthenticated } from "../store/slices/userSlice";
import { Settings } from "../types/Settings";
import { getDeviceId } from "../utils/voteUtils";

// Danh sách màu sắc khác nhau cho từng performance
const colors = ["#ff4d4f", "#40a9ff", "#36cfc9", "#ffec3d", "#9254de"];

const checkIfMobile = () => {
  return window.innerWidth <= 768;
};

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const performances = useSelector(
    (state: any) => state.performance.performances
  );
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const categories = useSelector((state: any) => state.category.categories);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [settingsData, setSettingsData] = useState<Settings>();
  const [backgroundImage, setBackgroundImage] = useState<string>("");

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    const updateBackground = () => {
      if (!settingsData) return;

      const isMobile = checkIfMobile();
      setBackgroundImage(
        isMobile ? settingsData.bgPhone : settingsData.bgDesktop
      );
    };

    updateBackground(); // Gọi khi settingsData thay đổi
    window.addEventListener("resize", updateBackground);

    return () => {
      window.removeEventListener("resize", updateBackground);
    };
  }, [settingsData]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      const data = res.data.data;
      dispatch(setCategories(data));
      setCategoryId(data[0].id);
    } catch (error) {
      console.log("Error fetching categories", error);
    }
  }, [dispatch]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await getSettings();
      const data = res.data.data;
      setSettingsData({
        bgDesktop: data[data.length - 1].bgDesktop,
        bgPhone: data[data.length - 1].bgPhone,
        buttonColor: data[data.length - 1].buttonColor,
        textColor: data[data.length - 1].textColor,
      });
    } catch (error) {
      console.log("Error adding performances", error);
    }
  }, []);

  const isVotingEnabled = useSelector((state: any) =>
    categoryId
      ? selectVotingEnabledByCategory(state, categoryId.toString())
      : false
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
    fetchSettings();
  }, [fetchCategories, fetchSettings]);

  useEffect(() => {
    if (categoryId !== null) {
      fetchPerformances();
    }
  }, [categoryId, fetchPerformances]);

  useEffect(() => {
    const deviceId = getDeviceId(); // bạn đã gọi ở trên đầu rồi
    if (categoryId) {
      socket.emit("register", { deviceId, categoryId });
    }
  }, [categoryId]);

  // Lắng nghe sự kiện từ WebSocket
  useEffect(() => {
    socket.on("vote-success", (message) => {
      console.log(message);
      // bạn có thể hiển thị toast hoặc alert
    });

    socket.on("vote-denied", (message) => {
      toast.warning(message);
    });

    socket.on("vote-updated", (data) => {
      dispatch(updateVote(data)); // cập nhật số phiếu vote
    });

    socket.on("votingStateChanged", (data) => {
      dispatch(setVotingState(data));
    });

    return () => {
      socket.off("vote-success");
      socket.off("vote-denied");
      socket.off("vote-updated");
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
    socket.emit("vote", {
      performanceId: selectedId,
      categoryId: categoryId,
    });
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

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div>
        <h1
          style={{
            margin: 0,
            marginBottom: checkIfMobile() ? "8%" : 0,
            fontSize: "2rem",
            textAlign: "center",
            color: settingsData?.textColor,
          }}
        >
          Kết Quả Bình Chọn
        </h1>
        <div
          style={{
            marginBottom: "24px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          {isAuthenticated ? (
            <div>
              <Button
                type="primary"
                onClick={handleVotePermission}
                className={`${styles.buttonCustom}`}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#1890ff",
                }}
              >
                {isVotingEnabled ? "Dừng Bình Chọn" : "Mở Bình Chọn"}
              </Button>
              <Button
                type="primary"
                onClick={() => navigate("/config")}
                className={styles.buttonCustom}
                style={{
                  marginRight: "10px",
                  backgroundColor: "#52c41a",
                  color: settingsData?.textColor,
                }}
              >
                Cài Đặt
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleLogout}
                className={styles.buttonCustom}
              >
                Đăng Xuất
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
      <div
        style={{
          maxWidth: "80%",
          margin: "0 auto",
        }}
      >
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
                marginBottom: checkIfMobile() ? "8%" : "4%",
                cursor: "pointer",
              }}
              onClick={() => handleSelect(performance.id)}
            >
              {/* mobile performance title*/}
              {checkIfMobile() && (
                <div
                  style={{
                    width: "100px",
                    fontWeight: "bold",
                    fontSize: "1.3rem",
                    color: colors[index % colors.length],
                    textShadow: "1px 1px 2px rgba(0,0,0, 0.7)",
                    marginLeft: "3%",
                    marginBottom: "3px",
                  }}
                >
                  {performance.name}
                </div>
              )}
              {/* progress bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                  border:
                    selectedId === performance.id
                      ? "5px solid #1890ff"
                      : "1px solid rgba(255, 255, 255, 0.3)",
                  borderRadius: 30,
                  // backgroundColor: "white",
                  background: "rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 4px 30px rgba(0, 0, 0, 0.1)",
                  backdropFilter: "blur(10px)",
                  WebkitBackdropFilter: "blur(10px)", // Safari support
                  padding: 10,
                }}
              >
                {!checkIfMobile() && (
                  <div
                    style={{
                      width: "100px",
                      fontWeight: "bold",
                      fontSize: "1.3rem",
                      color: colors[index % colors.length],
                      textShadow: "1px 1px 2px rgba(0,0,0, 0.7)",
                      marginLeft: "3%",
                    }}
                  >
                    {performance.name}
                  </div>
                )}
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
                    }}
                  />
                </div>
              </div>
              {!checkIfMobile() && (
                <div
                  style={{
                    color: colors[index % colors.length],
                    fontSize: checkIfMobile() ? "1rem" : "1.3rem",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0, 0.7)",
                    zIndex: 1,
                  }}
                >
                  {`${Math.round(percentage)}% (${performance.vote} phiếu)`}
                </div>
              )}
              {checkIfMobile() && (
                <span
                  style={{
                    color: colors[index % colors.length],
                    fontSize: checkIfMobile() ? "1rem" : "1.3rem",
                    fontWeight: "bold",
                    textShadow: "1px 1px 2px rgba(0,0,0, 0.7)",
                    zIndex: 1,
                  }}
                >
                  {`${Math.round(percentage)}% (${performance.vote} phiếu)`}
                </span>
              )}
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
        {!isVotingEnabled && (
          <Alert
            message={<b>Bình chọn đang được tắt!</b>}
            type="info"
            showIcon
          />
        )}
        {!selectedId && isVotingEnabled && (
          <Alert
            message={<b>Chọn một tiết mục để bình chọn</b>}
            type="info"
            showIcon
          />
        )}
        {selectedId && isVotingEnabled && (
          <Button
            className={styles.buttonCustom}
            type="primary"
            onClick={handleVote}
            size="large"
          >
            {!isVotingEnabled ? "Voting is currently disabled" : "Vote"}
          </Button>
        )}
      </div>
    </div>
  );
};

export default HomePage;
