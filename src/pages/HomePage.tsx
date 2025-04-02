import { Button, Card, Col, Progress, Row } from "antd";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "../pages/styles/Homepage.module.scss";
import { getPerformances, votePerformance } from "../services/userService";
import { Performance } from "../types/Performance";
import { setPerformances, updateVote } from "../store/slices/performanceSlice";
import socket from "../socket/socket";

// Danh sách màu sắc khác nhau cho từng performance
const colors = ["#ff4d4f", "#40a9ff", "#36cfc9", "#ffec3d", "#9254de"];

const HomePage = () => {
  const dispatch = useDispatch();
  const performances = useSelector(
    (state: any) => state.performance.performances
  );
  const [totalVotes, setTotalVotes] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const fetchPerformances = useCallback(async () => {
    try {
      const res = await getPerformances();
      const data = res.data.data;
      dispatch(setPerformances(data));
      // Tính tổng số lượng vote
      const total = data.reduce(
        (acc: number, p: Performance) => acc + p.vote,
        0
      );
      setTotalVotes(total);
    } catch (error) {
      console.error("Error fetching performances:", error);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchPerformances();

    // Lắng nghe sự kiện từ WebSocket
    socket.on("voteUpdate", (data) => {
      dispatch(updateVote(data));
    });

    return () => {
      socket.off("voteUpdate");
    };
  }, [dispatch, fetchPerformances]);

  const handleSelect = (id: string) => {
    setSelectedId((prevSelectedId) => (prevSelectedId === id ? null : id));
  };

  const handleVote = async () => {
    if (!selectedId) {
      return;
    }
    try {
      await votePerformance(selectedId);

      // Cập nhật lại tổng số lượng vote
      const updatedPerformances = performances.map((performance: any) =>
        performance.id === selectedId
          ? { ...performance, vote: performance.vote + 1 }
          : performance
      );

      const newTotalVotes = updatedPerformances.reduce(
        (acc: number, p: Performance) => acc + p.vote,
        0
      );
      setTotalVotes(newTotalVotes);

      // Cập nhật lại các tiết mục trong state
      dispatch(setPerformances(updatedPerformances));
    } catch (error) {
      console.error("Voting failed", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center", marginBottom: "20px" }}>
        Danh sách tiết mục
      </h1>
      <Row gutter={[16, 16]} style={{ justifyContent: "center" }}>
        {performances.map((performance: any, index: any) => {
          // Tính phần trăm vote
          const percentage =
            totalVotes > 0 ? (performance.vote / totalVotes) * 100 : 0;
          return (
            <Col xs={24} sm={12} md={8} lg={6} key={performance.id}>
              <Card
                className={`${styles.card} ${
                  selectedId === performance.id ? styles.selected : ""
                }`}
                title={performance.name}
                bordered={false}
                style={{
                  backgroundColor: colors[index % colors.length],
                  color: "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
                onClick={() => handleSelect(performance.id)}
              >
                <p style={{ fontSize: "18px", marginBottom: "10px" }}>
                  Votes: {performance.vote}
                </p>
                <Progress percent={Math.round(percentage)} strokeColor="#fff" />
              </Card>
            </Col>
          );
        })}
      </Row>
      <div
        style={{ padding: "20px", display: "flex", justifyContent: "center" }}
      >
        <Button
          className={styles.buttonCustom}
          type="primary"
          onClick={handleVote}
          disabled={!selectedId}
        >
          Vote
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
