/**
 * Cell Groups & Cell Registry seed builder.
 * Based on Cell Report July Week 1 group structure.
 * Attached to window for frontend-first dashboard bootstrap.
 */
(function () {
  const CELL_GROUP_DEFINITIONS = [
    { name: "Dominio", total_cells: 2 },
    { name: "Visionarios", total_cells: 1 },
    { name: "Transformadas", total_cells: 3 },
    { name: "Gods CEO Main", total_cells: 17, needs_review: true },
    { name: "Diplomats Victory", total_cells: 9 },
    { name: "Wealth Nation Main", total_cells: 10 },
    { name: "Mulheres de Substancia Main", total_cells: 10, needs_review: true },
    { name: "Homens de Propósito", total_cells: 8 },
    { name: "Perola do Reino Main", total_cells: 10, needs_review: true },
    { name: "Queens of Glory Main", total_cells: 6, needs_review: true },
    { name: "Agathos Main", total_cells: 7 },
    { name: "Phronesis Business Main", total_cells: 9 },
    { name: "Pais de Fe", total_cells: 7 },
    { name: "Estrelas de Si�o", total_cells: 8, needs_review: true },
    { name: "Vanguard Main", total_cells: 7 },
    { name: "Mighty Women of Valor Main", total_cells: 10 },
    { name: "Luzes de Si�o", total_cells: 5, needs_review: true },
    { name: "Gera��o Eleita Main", total_cells: 5 },
    { name: "Gera��o Eleita Supreme", total_cells: 4, needs_review: true },
    { name: "Pioneiros Substance", total_cells: 14 },
    { name: "Pioneiros Charis", total_cells: 4 },
    { name: "Realeza Central", total_cells: 17 },
    { name: "Realeza Valentes", total_cells: 4 },
    { name: "Realeza Brilhante", total_cells: 14 },
    { name: "Realeza Gera��o Esperan�a", total_cells: 7, needs_review: true },
    { name: "Royal Sisters Main", total_cells: 19 },
    { name: "Royal Sisters Shine Main", total_cells: 6 },
    { name: "Royal Sisters Dominion", total_cells: 6 },
    { name: "Royal Sisters Excellence", total_cells: 5 },
    { name: "Coroa Real Main", total_cells: 5, needs_review: true },
    { name: "Coroa Real Rainhas de Cristo", total_cells: 7, needs_review: true },
    { name: "Blossom Main", total_cells: 3 },
    { name: "Blossom Perfection Main", total_cells: 7 },
    { name: "Blossom Diamante Main", total_cells: 5 },
    { name: "Na��o Santa", total_cells: 11 },
    { name: "Men of Vision", total_cells: 14 },
    { name: "Men of Vision Giants", total_cells: 4, needs_review: true },
    { name: "Elevadas Main", total_cells: 28, needs_review: true },
    { name: "Destemidas Main", total_cells: 9 },
    { name: "Genesis Main", total_cells: 9 },
    { name: "Genesis Eternal Excellence", total_cells: 4, needs_review: true },
    { name: "Ambassadors Main", total_cells: 16 }
  ];

  const GROUP_STATUSES = ["Activo", "Em Crescimento", "Precisa de Aten��o", "Inactivo"];
  const LEADER_TITLES = ["Irm�o", "Irm�", "Pastor", "Di�cono"];

  function buildCellGroupsSeed() {
    const cellGroups = [];
    const cellRegistry = [];
    let cellSeq = 1;

    CELL_GROUP_DEFINITIONS.forEach((def, index) => {
      const groupId = `cg-${String(index + 1).padStart(3, "0")}`;
      const status = index % 11 === 0
        ? "Inactivo"
        : index % 7 === 0
          ? "Precisa de Aten��o"
          : index % 4 === 0
            ? "Em Crescimento"
            : "Activo";
      const membersPerCell = 7 + (index % 6);
      const leaderName = index % 3 === 0 ? `Líder ${def.name.split(" ")[0]}` : "";

      cellGroups.push({
        id: groupId,
        group_name: def.name,
        leader_name: leaderName,
        church_id: "church-hq",
        total_cells: def.total_cells,
        total_members: def.total_cells * membersPerCell,
        status,
        responsible_area: "Sister Eduarda / Cell Reports",
        needs_review: Boolean(def.needs_review),
        created_by: "Sister Eduarda",
        updated_by: "Sister Eduarda",
        created_at: "2026-07-01",
        updated_at: "2026-07-10"
      });

      for (let i = 1; i <= def.total_cells; i += 1) {
        const seed = index * 17 + i * 3;
        const attendance = 5 + (seed % 16);
        const firstTimers = seed % 4;
        const newConverts = seed % 3;
        const offering = 350 + attendance * 90 + firstTimers * 110;
        const rs = Math.max(1, Math.floor(attendance / 5));
        const cellStatus = status === "Precisa de Aten��o" && i % 2 === 0
          ? "Precisa de Aten��o"
          : status === "Inactivo"
            ? "Inactivo"
            : "Activo";

        cellRegistry.push({
          id: `cr-${String(cellSeq).padStart(4, "0")}`,
          cell_name: `${def.name} ${i}`,
          group_id: groupId,
          group_name: def.name,
          leader_title: LEADER_TITLES[seed % LEADER_TITLES.length],
          leader_name: leaderName || `Líder ${i}`,
          church_id: "church-hq",
          attendance,
          first_timers: firstTimers,
          new_converts: newConverts,
          offering,
          rs,
          observation: firstTimers + newConverts >= 4 ? "EXPLOSAO - pronta para multiplica��o." : "",
          status: cellStatus,
          report_week: "Julho Semana 1",
          created_by: "Sister Eduarda",
          updated_by: "Sister Eduarda",
          created_at: "2026-07-05",
          updated_at: "2026-07-10"
        });
        cellSeq += 1;
      }
    });

    return { cellGroups, cellRegistry };
  }

  window.buildCellGroupsSeed = buildCellGroupsSeed;
})();