const pool = require('../config/db');

exports.getEvents = async (req, res) => {
    try {
        const { id_machine } = req.params;
        let { data_inicial, data_final } = req.query;

        if (!data_inicial) data_inicial = '';
        if (!data_final) data_final = '';

        const itemsPerPage = 15;
        const currentPage = parseInt(req.query.page) || 1;
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;

        const queryParams = [id_machine];

        const filtrosDeData = [];
        if (data_inicial) {
            filtrosDeData.push('DATE(created_at) >= $2::timestamp');
            queryParams.push(data_inicial);
        }
        if (data_final) {
            filtrosDeData.push('DATE(created_at) <= $3::timestamp');
            queryParams.push(data_final);
        }

        const clausulaDeFiltroDeData = filtrosDeData.length ? ' AND ' + filtrosDeData.join(' AND ') : '';

        const query1 = `
            SELECT 
                id as "ID",
                TO_CHAR(created_at, 'DD/MM/YYYY HH24:MI') AS "Data",
                payload -> 'brita' as "Brita",	
                payload -> 'cimento' as "Cimento",
                payload -> 'areiaInd' as "Areia Ind.",
                payload -> 'areiaRio' as "Areia Rio", 
                payload -> 'granilha' as "Granilha"
            FROM public.events
            WHERE (machine_id = $1 OR $1 IS NULL)${clausulaDeFiltroDeData}
            ORDER BY created_at DESC
        `;

        const query2 = `
            SELECT 
                TO_CHAR(DATE_TRUNC('day', created_at), 'DD/MM/YYYY') AS "Data",
                SUM((payload ->> 'brita')::numeric) as "Brita",
                SUM((payload ->> 'cimento')::numeric) as "Cimento",
                SUM((payload ->> 'areiaInd')::numeric) as "Areia Ind.",
                SUM((payload ->> 'areiaRio')::numeric) as "Areia Rio",
                SUM((payload ->> 'granilha')::numeric) as "Granilha",
                ARRAY[
                    SUM((payload ->> 'brita')::numeric),
                    SUM((payload ->> 'cimento')::numeric),
                    SUM((payload ->> 'areiaInd')::numeric),
                    SUM((payload ->> 'areiaRio')::numeric),
                    SUM((payload ->> 'granilha')::numeric)
                ] as "ArraySummary"
            FROM public.events
            WHERE (machine_id = $1 OR $1 IS NULL)${clausulaDeFiltroDeData}
            GROUP BY DATE_TRUNC('day', created_at)
            ORDER BY DATE_TRUNC('day', created_at) ASC
        `;

        const [result1, result2] = await Promise.all([
            pool.query(query1, queryParams),
            pool.query(query2, queryParams),
        ]);

        const events = result1.rows;
        const summary = result2.rows;

        const eventsToShow = events.slice(startIndex, endIndex);

        res.render('index', {
            result1,
            result2,
            eventsToShow,
            summary,
            id_machine,
            currentPage,
            totalPages: Math.ceil(events.length / itemsPerPage),
            totalEvents: events.length,
            data_final,
            data_inicial
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('1Erro ao obter os itens.');
    }
};

exports.createEvent = async (req, res) => {
    const { event_type_id, line_id, machine_id, payload } = req.body;
    try {
        await pool.query(
            'INSERT INTO events (event_type_id, line_id, machine_id, payload) VALUES($1, $2, $3, $4)',
            [event_type_id, line_id, machine_id, payload]
        );
        res.status(200).send('OK');
    } catch (error) {
        console.error(error);
        res.status(500).send('Erro ao criar o item.');
    }
};

exports.getUpdatePage = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await pool.query('SELECT * FROM events WHERE id = $1', [id]);
        const evento = result.rows[0];
        res.render('update', { evento });
    } catch (error) {
        console.error(error);
        res.status(500).send('2Erro ao obter o item.');
    }
};

exports.updateEvent = async (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    try {
        await pool.query('UPDATE events SET title = $1, description = $2 WHERE id = $3', [title, description, id]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('3Erro ao atualizar o item.');
    }
};

exports.deleteEvent = async (req, res) => {
    const id = req.params.id;
    try {
        await pool.query('DELETE FROM events WHERE id = $1', [id]);
        res.redirect('/');
    } catch (error) {
        console.error(error);
        res.status(500).send('4Erro ao deletar o item.');
    }
};

exports.viewGermana = async (req, res) => {
    const id = req.params.id;
    try {
        res.render('tanques',{});
    } catch (error) {
        console.error(error);
        res.status(500).send('Eroo');
    }
};

exports.viewGraph = async (req, res) => {
    const id = req.params.id;
    try {
        res.render('tanks_graph',{});
    } catch (error) {
        console.error(error);
        res.status(500).send('Eroo');
    }
};
