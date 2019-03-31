
CREATE TABLE IF NOT EXISTS scanData (
    ip              VARCHAR(16) NOT NULL,
    hostname        VARCHAR(129),
    host_status     VARCHAR(20) DEFAULT 'down',
    port_id1        TEXT,
    port_id2        TEXT,
    port_id3        TEXT,
    port_id4        TEXT,
    protocol1       VARCHAR(4) NOT NULL,
    protocol2       VARCHAR(4) NOT NULL,
    protocol3       VARCHAR(4) NOT NULL,
    protocol4       VARCHAR(4) NOT NULL,
    port_state1     TEXT,
    port_state2     TEXT,
    port_state3     TEXT,
    port_state4     TEXT,
    service1        TEXT,
    service2        TEXT,
    service3        TEXT,
    service4        TEXT,
    start_time      TIMESTAMP,
    stop_time       TIMESTAMP
);

CREATE TRIGGER IF NOT EXISTS fkd_ports_scanData_ip
BEFORE DELETE ON scanData
FOR EACH ROW BEGIN
    DELETE from ports WHERE ip = OLD.ip;
END;