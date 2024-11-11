import { format} from 'date-fns'
import { fr } from 'date-fns/locale';

const formatDate = (dateISO) => format(new Date(dateISO), "dd MMM yyyy", { locale: fr });

export default formatDate;