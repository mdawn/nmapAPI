
CREATE TABLE IF NOT EXISTS scanData (
    result_id       INTEGER NOT NULL,
    ip              VARCHAR(16) PRIMARY KEY NOT NULL,
    hostname        VARCHAR(129),
    port_id         TEXT,
    protocol        VARCHAR(5) DEFAULT 'ipv4',
    status_state    VARCHAR(20) DEFAULT 'down',
    port_reason     TEXT,
    port_reason_ttl TEXT,
    start_time      TIMESTAMP,
    stop_time       TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ports (
    ip          VARCHAR(16) NOT NULL,
    port        INTEGER NOT NULL,
    protocol    VARCHAR(4) NOT NULL,
    name        VARCHAR(33),
    port_state  VARCHAR(33) DEFAULT 'closed',
    service     TEXT,
    info        TEXT,
    PRIMARY KEY (ip, port, protocol),
    CONSTRAINT fk_ports_scanData FOREIGN KEY (ip) REFERENCES scanData(ip) ON DELETE CASCADE
);

CREATE TRIGGER IF NOT EXISTS fki_ports_scanData_ip
BEFORE INSERT ON ports
FOR EACH ROW BEGIN
    SELECT CASE
        WHEN ((SELECT ip FROM scanData WHERE ip = NEW.ip) IS NULL)
        THEN RAISE(ABORT, 'insert on table "ports" violates foreign key constraint "fk_ports_hosts"')
    END;
END;

CREATE TRIGGER IF NOT EXISTS fku_ports_scanData_ip
BEFORE UPDATE ON ports
FOR EACH ROW BEGIN
    SELECT CASE
        WHEN ((SELECT ip FROM scanData WHERE ip = NEW.ip) IS NULL)
        THEN RAISE(ABORT, 'update on table "scanData" violates foreign key constraint "fk_ports_hosts"')
    END;
END;

CREATE TRIGGER IF NOT EXISTS fkd_ports_scanData_ip
BEFORE DELETE ON scanData
FOR EACH ROW BEGIN
    DELETE from ports WHERE ip = OLD.ip;
END;
