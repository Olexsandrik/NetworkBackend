FROM mongo:4

# Запускаємо MongoDB у фоні
ENTRYPOINT mongod --port $MONGO_REPLICA_PORT --replSet rs0 --bind_ip_all & MONGOD_PID=$!; \
# Ініціалізація реплікаційного набору
INIT_REPL_CMD="rs.initiate({ _id: 'rs0', members: [{ _id: 0, host: '$MONGO_REPLICA_HOST:$MONGO_REPLICA_PORT' }] })"; \
# Створення root-користувача
INIT_USER_CMD="db.getSiblingDB('admin').createUser({ user: '$MONGO_INITDB_ROOT_USERNAME', pwd: '$MONGO_INITDB_ROOT_PASSWORD', roles: [{ role: 'root', db: 'admin' }] })"; \
# Очікуємо готовності сервера і виконуємо ініціалізацію
until mongo admin --port $MONGO_REPLICA_PORT --eval "$INIT_REPL_CMD" && mongo admin --port $MONGO_REPLICA_PORT --eval "$INIT_USER_CMD"; do sleep 1; done; \
# Залишаємо процес MongoDB активним
echo "REPLICA SET ONLINE"; wait $MONGOD_PID;
