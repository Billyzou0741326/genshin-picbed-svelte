import ecsFormat from '@elastic/ecs-pino-format';
import pino from 'pino';

const log = pino(ecsFormat());
console.log = () => {}; // Disabling console logging (server-side).
export default log;
