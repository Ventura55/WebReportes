import React, { useState, useEffect, useRef, useMemo } from 'react';
import './AppMain.css'
import { User, Calendar, ClipboardPenLine, Plus, ArrowLeft, Trash2, Check, ClipboardList, ClipboardPen, Clipboard, X, BookOpenText, Logs, FileCheck, FilePlus, ListFilterPlus, Edit } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios'
import { PDFDocument } from 'pdf-lib';

function AppMain() {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || "Admin";
  const password = location.state?.password || "";
  const dropdownRef = useRef(null);
  const [showFilter, setShowFilter] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [historial, setHistorial] = useState([]);
  const [active, setActive] = useState("proyectos");
  const [usernameFilter, setUsernameFilter] = useState('');
  const [proyectFilter, setProyectFilter] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showUser, setShowUser] = useState(false);

  // Select de los nuevos registros
  const [user, setUser] = useState([]);
  const [proyects, setProyects] = useState([
    //id: "1",proyect: "Proyecto de prueba",subpriority: 1,dateStart: "2025-09-01",dateEnd: "2025-09-15",description: "Esto es solo un test local",priority: "media",completed: 0
  ]);
  const [task, setTask] = useState([]);
  const [report, setReport] = useState([])
  const [log, setLog] = useState([]);
  const [infoUser, setInfoUser] = useState([]);

  useEffect(() => {
    const auth = { username, password };

    Promise.all([
      axios.get('http://tareas.quirosingenieria.es:8081/api/user/info/all', { auth }),
      axios.get('http://tareas.quirosingenieria.es:8081/api/history/proyect', { auth }),
      axios.get('http://tareas.quirosingenieria.es:8081/api/history/task', { auth }),
      axios.get('http://tareas.quirosingenieria.es:8081/api/history/report', { auth }),
      axios.get('http://tareas.quirosingenieria.es:8081/api/history/report/complete', { auth }),
      axios.get('http://tareas.quirosingenieria.es:8081/api/user/info', { auth })
    ])
      .then(([userRes, proyectRes, taskRes, reportRes, logRes, userInfoRes]) => {
        const normalizedData = proyectRes.data.map(p => ({
          ...p,
          completed: Number(p.complete)
        }));
        setUser(userRes.data);
        setProyects(normalizedData);
        const uniqueTask = Array.from(new Map(taskRes.data.map(t => [t.task, t])).values());
        setTask(uniqueTask);
        setReport(reportRes.data);
        setLog(logRes.data);
        setInfoUser(userInfoRes.data);
      })
      .catch(err => {
        console.error('Error al cargar datos:', err);
      });
  }, [])

  // Cerrar dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showMenu]);

  // Nuevo Registro
  const [showForm, setShowForm] = useState(false);
  const [showInform, setShowInform] = useState(false);
  const [showDescription, setShowDescription] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    proyect: '',
    task: '',
    hours: '',
    description: ''
  });

  const [formProyect, setFormProyect] = useState({
    priority: '',
    subpriority: '',
    proyect: '',
    dateStart: new Date().toISOString().split("T")[0],
    dateEnd: '',
    description: '',
    complete: ''
  });

  const [payload, setPayload] = useState({});

  const [formTask, setFormTask] = useState({
    task: ''
  })

  const [formReport, setFormReport] = useState({
    priority: '',
    company: '',
    location: '',
    date: `${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`,
    description: ''
  })

  const [formUser, setFormUser] = useState({
    username: '',
    gmail: '',
    password: '',
    rol: ''
  })

  const [editableUser, setEditableUser] = useState({
    id: '',
    username: '',
    gmail: '',
    password: '',
    rol: ''
  });

  useEffect(() => {
    setEditableUser({
      id: infoUser.id || '',
      username: infoUser.username || '',
      gmail: infoUser.gmail || '',
      password: '',
      rol: infoUser.rol || ''
    });
  }, [infoUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableUser(prev => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://tareas.quirosingenieria.es:8081/api/history/create/history', formData, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(res => {
      alert(res.data.message || "Registro guardado con éxito");

      if (res.data.newHistory) {
        setHistorial(prev => [...prev, res.data.newHistory]);
      } else {
        axios.get('http://tareas.quirosingenieria.es:8081/api/history', {
          auth: { username: 'ventu', password: '123' }
        }).then(res => {
          setHistorial(res.data);
        }).catch(err => {
          console.error("Error al obtener historial actualizado:", err);
        });
      }

      setFormData({
        username: '',
        proyect: '',
        task: '',
        hours: '',
        description: ''
      })
      setShowForm(false);
    }).catch(err => {
      console.error("Error al guardar el historial", err);
    })
  }

  // Crear y borrar Proyecto
  const handleChangeProyect = (e) => {
    const { name, value } = e.target;

    if (name === "dateEnd") {
      const [year, month, day] = value.split("-");
      setFormProyect({ ...formProyect, [name]: value });
      setPayload({ ...payload, dateEnd: `${month}-${day}` });
    } else {
      setFormProyect({ ...formProyect, [name]: value });
      setPayload({ ...payload, [name]: value });
    }
  };

  const handleSubmitProyect = (e) => {
    e.preventDefault();
    axios.post('http://tareas.quirosingenieria.es:8081/api/history/create/proyect', formProyect, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(res => {
      alert(res.data.message || "Proyecto guardado con éxito");

      if (res.data.newProyect) {
        setProyects(prev => [...prev, res.data.newProyect]);
      } else {
        axios.get('http://tareas.quirosingenieria.es:8081/api/history/proyect', {
          auth: { username: 'ventu', password: '123' }
        }).then(res => {
          setProyects(res.data);
        }).catch(err => {
          console.error("Error al obtener historial actualizado:", err);
        });
      }

      setShowForm(false);
    }).catch(err => {
      console.error("Error al guardar proyecto", err);
    })
  }

  const handleDeleteProyect = (id) => {
    axios.delete(`http://tareas.quirosingenieria.es:8081/api/history/delete/proyect/${id}`, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(() => {
      setProyects(prev => prev.filter(p => p.id !== id));
    }).catch(err => {
      console.error("Error al eliminar proyecto", err);
    });
  };

  const updateProyectStatus = (id, newStatus) => {
    axios.put(`http://tareas.quirosingenieria.es:8081/api/history/update/proyect/${id}`,
      { completed: newStatus ? 1 : 0 },
      {
        auth: {
          username: 'ventu',
          password: '123'
        }
      }
    ).then(res => {
      console.log('Proyecto actualizado:', res.data);
      // Actualizar el estado en local
      setProyects(prev =>
        prev.map(p =>
          p.id === id ? { ...p, completed: newStatus } : p
        )
      );
    }).catch(err => {
      console.error('Error al actualizar el estado del proyecto:', err);
    });
  };

  // Crear y borrar Tarea
  const handleChangeTask = (e) => {
    const { name, value } = e.target;
    setFormTask({ ...formTask, [name]: value });
  };

  const handleSubmitTask = (e) => {
    e.preventDefault();
    axios.post('http://tareas.quirosingenieria.es:8081/api/history/create/task', formTask, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(res => {
      alert(res.data.message || "Tarea guardado con éxito");

      if (res.data.newTask) {
        setTask(prev => [...prev, res.data.newTask]);
      } else {
        axios.get('http://tareas.quirosingenieria.es:8081/api/history/task', {
          auth: { username: 'ventu', password: '123' }
        }).then(res => {
          setTask(res.data);
        }).catch(err => {
          console.error("Error al obtener historial actualizado:", err);
        });
      }

      setShowForm(false);
    }).catch(err => {
      console.error("Error al guardad tarea", err);
    })
  }

  const handleDeleteUser = (id) => {
    axios.delete(`http://tareas.quirosingenieria.es:8081/api/user/delete/${id}`, {
      auth: { username, password }
    }).then(() => {
      setUser(prev => prev.filter(u => u.id !== id));
    }).catch(err => {
      console.error("Error al eliminar usuario", err);
    });
  };

  const handleDeleteTask = (id) => {
    axios.delete(`http://tareas.quirosingenieria.es:8081/api/history/delete/task/${id}`, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(() => {
      setTask(prev => prev.filter(t => t.id !== id));
    }).catch(err => {
      console.error("Error al eliminar tarea", err);
    });
  };

  // Crear Reporte 
  const handleChangeReport = (e) => {
    const { name, value } = e.target;
    setFormReport({ ...formReport, [name]: value });
  }

  const handleSubmitReport = (e) => {
    e.preventDefault();
    axios.post('http://tareas.quirosingenieria.es:8081/api/history/create/report', formReport, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(res => {
      alert(res.data.message || "Reporte guardado con éxito");

      if (res.data.newReport) {
        setReport(prev => [...prev, res.data.newReport]);
      } else {
        axios.get('http://tareas.quirosingenieria.es:8081/api/history/report', {
          auth: { username: 'ventu', password: '123' }
        }).then(res => {
          setReport(res.data);
        }).catch(err => {
          console.error("Error al obtener historial actualizado:", err);
        });
      }

      setShowForm(false);
    }).catch(err => {
      console.error("Error al guardar el reporte", err);
    })
  }

  const handleCompleteReport = async (id) => {
    try {
      await axios.post(`http://tareas.quirosingenieria.es:8081/api/history/complete/report/${id}`, {}, {
        auth: {
          username: 'ventu',
          password: '123'
        }
      }).then(res => {
        // Eliminarlo del estado del frontend (sin recargar toda la página)
        setReport(prev => prev.filter(r => r.id !== id));

        if (res.data.newCompleteReport) {
          setLog(prev => [...prev, res.data.newCompleteReport]);
        } else {
          axios.get('http://tareas.quirosingenieria.es:8081/api/history/report/complete', {
            auth: { username: 'ventu', password: '123' }
          }).then(rese => {
            setLog(rese.data);
          }).catch(err => {
            console.error("Error al tener los logs actualizados:", err);
          })
        }
      })
    } catch (error) {
      console.error("Error al completar el reporte:", error);
      alert("Hubo un error al completar el reporte.");
    }
  };

  // Crear Usuarios
  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setFormUser({ ...formUser, [name]: value });
  };

  const handleSubmitUser = (e) => {
    e.preventDefault();
    axios.post('http://tareas.quirosingenieria.es:8081/api/user/create/user', formUser, {
      auth: {
        username: 'ventu',
        password: '123'
      }
    }).then(res => {
      alert(res.data.message || "Usuario guardado con éxito");
      setInfoUser(res.data);

      setFormUser({
        username: '',
        gmail: '',
        password: '',
        rol: ''
      });
    })
  }

  // Editar usuario
  const handleSaveUser = () => {
    axios.put('http://tareas.quirosingenieria.es:8081/api/user/update', editableUser, {
      auth: {
        username,
        password
      }
    }).then(res => {
      alert(res.data.message || "Usuario actualizado");
      setInfoUser(res.data);
      setIsEditing(false);
    }).catch(err => {
      console.error("Error al actualizar usuario:", err);
      console.log('editableUser', editableUser);
    });
  };

  //Editar la tabla de proyectos
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const handleEditClick = (proyec) => {
    setEditingId(proyec.id);
    setEditForm({ ...proyec });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({ ...editForm, [name]: value });
  };

  const handleSaveEdit = (id, editForm) => {
    axios.put(`http://tareas.quirosingenieria.es:8081/api/history/edit/proyect/${id}`, editForm, {
      auth: {
        username,
        password
      }
    }).then(res => {
      alert(res.data.messaage || "Proyecto actualizado");
      setProyects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...editForm } : p)));
      setEditingId(null);
      return res.data;
    }).catch(err => {
      console.error("Error al actualizar proyecto:", err);
      console.log("editForm", editForm);
      throw err;
    });
  };


  // Cargar los datos al cargar la página
  useEffect(() => {
    axios.get('http://tareas.quirosingenieria.es:8081/api/history', {
      auth: { username, password }
    })
      .then(res => {
        setHistorial(res.data);
      })
      .catch(err => {
        console.error("Error al obtener historial:", err);
      });
  }, []);

  // Rellenar automaticamente los PDF
  const fillPdfControl = async () => {
    const formUrl = '/files/FRONIUS - PLANTILLA - Informe Formacion.pdf';
    const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField('Text2').setText(username);
    form.getTextField('Date5_es_:signer:date').setText(new Date().toISOString().split('T')[0]);

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Informe-formacion.pdf';
    link.click();
  }

  const fillPdfParte = async (report) => {
    const formUrl = '/files/PARTE AVERIA_V3_PLANTILLA.pdf';
    const existingPdfBytes = await fetch(formUrl).then(res => res.arrayBuffer());

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const form = pdfDoc.getForm();

    form.getTextField('Text3').setText(report.id.toString());
    form.getTextField('Text4').setText(new Date().toISOString().split('T')[0]);
    form.getTextField('Text5').setText(report.location);
    form.getTextField('Text7').setText(report.company);
    form.getTextField('Text9').setText(username);
    form.getTextField('Text13').setText(username);

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Parte-averia.pdf';
    link.click();
  }

  // Prioridad reportes
  const priorityReport = {
    alta: 1,
    media: 2,
    baja: 3
  };

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  // Filtrar proyectos
  const toggleFilter = () => {
    setShowFilter(!showFilter);
  }

  const [filters, setFilters] = useState({
    startDate: false,
    endDate: false,
    completed: false,
    incomplete: false
  })

  // Filtrar datos de registro por usuario
  const filteredHistory = historial.filter((item) => item.user.toLowerCase().includes(usernameFilter.toLowerCase()));

  // Filtrar los proyectos por el nombre
  const filteredProyect = useMemo(() => {
    return proyects
      .filter(item =>
        item.proyect.toLowerCase().includes(proyectFilter.toLowerCase())
      )
      .filter(proyec => {
        if (filters.incomplete && proyec.completed === 1) return false;
        if (filters.completed && proyec.completed !== 1) return false;
        return true;
      })
      .sort((a, b) => {
        const getPriority = (p) => priorityReport[p?.toLowerCase()] ?? 999;
        const priorityDiff = getPriority(a.priority) - getPriority(b.priority);
        if (priorityDiff !== 0) return priorityDiff;
        return a.subpriority - b.subpriority;
      });
  }, [proyects, filters, proyectFilter]);

  const changeSubpriority = (id, diff) => {
    setProyects((prev) => {
      if (!Array.isArray(prev)) {
        console.error('[changeSubpriority] projects NO es array:', prev);
        return prev;
      }

      // clonamos array y objetos (no mutamos)
      const updated = prev.map(p => ({ ...p }));

      // buscar por id tolerando string/number
      const idStr = String(id);
      const index = updated.findIndex(p => String(p.id) === idStr);
      if (index === -1) {
        console.warn('[changeSubpriority] id no encontrado en projects:', id);
        return prev;
      }

      const current = updated[index];
      if (!('subpriority' in current)) {
        console.warn('[changeSubpriority] proyecto sin subpriority:', current);
        return prev;
      }

      // obtener grupo de misma prioridad ordenado por subpriority (numérico)
      const samePriority = updated
        .filter(p => p.priority === current.priority)
        .sort((a, b) => Number(a.subpriority) - Number(b.subpriority));

      const pos = samePriority.findIndex(p => String(p.id) === idStr);
      const targetPos = pos + diff;

      if (targetPos < 0 || targetPos >= samePriority.length) {
        console.log('[changeSubpriority] no se puede mover (ya es primer/último)');
        return prev;
      }

      // neighbor id y su index real dentro de `updated`
      const neighborId = samePriority[targetPos].id;
      const neighborIndex = updated.findIndex(p => String(p.id) === String(neighborId));
      if (neighborIndex === -1) {
        console.error('[changeSubpriority] neighbor no encontrado:', neighborId);
        return prev;
      }

      // clonamos ambos, swap de subpriority
      const curClone = { ...updated[index] };
      const neighClone = { ...updated[neighborIndex] };
      const tmp = curClone.subpriority;
      curClone.subpriority = neighClone.subpriority;
      neighClone.subpriority = tmp;

      // escribir de nuevo en array
      updated[index] = curClone;
      updated[neighborIndex] = neighClone;

      console.log('[changeSubpriority] swap realizado:', {
        moved: curClone.id, newSub: curClone.subpriority,
        swappedWith: neighClone.id, newSubNeighbor: neighClone.subpriority
      });

      // llamada optimista al backend (no bloquear el setState)
      // Si handleSaveEdit devuelve Promise puedes capturar errores
      try {
        handleSaveEdit(curClone.id, curClone).catch(e => {
          console.error('save current failed', e);
          // opcional: rollback o re-fetch
        });
        handleSaveEdit(neighClone.id, neighClone).catch(e => {
          console.error('save neighbor failed', e);
        });
      } catch (err) {
        console.error('handleSaveEdit threw', err);
      }

      return updated;
    });
  };

  const logout = () => {
    navigate("/");
  };


  return (
    <div className='Main'>
      <header className='Main-header'>
        <img src="/logoQuiros.png" onClick={() => setMobileMenuOpen(true)} />
        <div className='usuario' onClick={toggleMenu}>
          <User />
          <strong>{username}</strong>
        </div>
        {showMenu && (
          <div className='dropdown' ref={dropdownRef}>
            <button className={active === "cuenta" ? "active" : ""} onClick={() => { setActive("cuenta"); setMobileMenuOpen(false); setShowMenu(false); }}>Usuario</button><br />
            <button onClick={logout}>Cerrar Sesion</button>
          </div>
        )}
      </header>
      <main>
        <div className={`Main-menu ${mobileMenuOpen ? 'mobile-open' : ""}`}>
          {mobileMenuOpen && (
            <button className='close-mobile-menu' onClick={() => setMobileMenuOpen(false)}><X /></button>
          )}
          <button className={active === "proyectos" ? "active" : ""} onClick={() => { setActive("proyectos"); setMobileMenuOpen(false); }}><Calendar />Registro Horas</button>
          <button className={active === "reportes" ? "active" : ""} onClick={() => { setActive("reportes"); setMobileMenuOpen(false); }}><ClipboardPenLine />Asistencias</button>
        </div>

        <div className='Main-body'>
          {active === "proyectos" && (
            <>
              <button onClick={() => setActive("registro")}><Logs />Ver Logs</button>
              <button onClick={() => setShowForm(true)}><Plus />Añadir Proyecto</button>
              <input className='main-input' name='proyect' placeholder='Buscar proyecto' value={proyectFilter} onChange={(e) => setProyectFilter(e.target.value)}></input>
              <div className='filter-wrapper'>
                <button onClick={toggleFilter} className='button-filter'><ListFilterPlus />Filtrar</button>
                {showFilter && (
                  <div className='dropdown-filter'>
                    <table>
                      <tbody>
                        <tr>
                          <td><input type='checkbox' checked={filters.incomplete} onChange={() => setFilters({ ...filters, incomplete: !filters.incomplete })} /></td>
                          <td>Incompleto</td>
                        </tr>
                        <tr>
                          <td><input type='checkbox' checked={filters.completed} onChange={() => setFilters({ ...filters, completed: !filters.completed })} /></td>
                          <td>Completado</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
              {showForm && (
                <div className='modal-overlay'>
                  <div className='modal'>
                    <h2>Nuevo Proyecto</h2>
                    <form onSubmit={handleSubmitProyect}>
                      <input name='proyect' placeholder='Proyecto' value={formProyect.proyect} onChange={handleChangeProyect} required />
                      <input type='hidden' name='dateStart' value={formProyect.dateStart} onChange={handleChangeProyect} />
                      <input type='date' name='dateEnd' placeholder='Fecha de entrega' value={formProyect.dateEnd} onChange={handleChangeProyect} required />
                      <div className='priority-row'>
                        <span className='priority-label'>Prioridad:</span>
                        <div className='priority-selector'>
                          <div className={`priority-circle red ${formProyect.priority === 'alta' ? 'selected' : ''}`} onClick={() => setFormProyect({ ...formProyect, priority: 'alta' })} title="Alta"></div>
                          <div className={`priority-circle yellow ${formProyect.priority === 'media' ? 'selected' : ''}`} onClick={() => setFormProyect({ ...formProyect, priority: 'media' })} title='Media'></div>
                          <div className={`priority-circle green ${formProyect.priority === 'baja' ? 'selected' : ''}`} onClick={() => setFormProyect({ ...formProyect, priority: 'baja' })} title='Baja'></div>
                        </div>
                      </div>
                      <input name='description' placeholder='Descripcion' value={formProyect.description} onChange={handleChangeProyect} />
                      <input type='hidden' name='priority' value={formProyect.priority} />
                      <button type='submit'>Guardar</button>
                      <button type='button' onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                  </div>
                </div>
              )}
              <table className='table'>
                <thead>
                  <tr>
                    <td></td>
                    <td>Proyecto</td>
                    <td>Inicio</td>
                    <td>Previsto</td>
                    <td>Descripcion</td>
                    <td>Completar</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {filteredProyect.map((proyec, index) => (
                    <tr key={index}>
                      {editingId === proyec.id ? (
                        <td className="priority-edit-cell">
                          <div
                            className={`priority-option red ${editForm.priority === 'alta' ? 'selected' : ''}`}
                            onClick={() => setEditForm({ ...editForm, priority: 'alta' })}
                          />
                          <div
                            className={`priority-option yellow ${editForm.priority === 'media' ? 'selected' : ''}`}
                            onClick={() => setEditForm({ ...editForm, priority: 'media' })}
                          />
                          <div
                            className={`priority-option green ${editForm.priority === 'baja' ? 'selected' : ''}`}
                            onClick={() => setEditForm({ ...editForm, priority: 'baja' })}
                          />
                          {/* Subpriority */}
                          <div className="subpriority-cell">
                            <button onClick={() => changeSubpriority(proyec.id, 1)} disabled={editForm.subpriority >= 99}>↓</button>
                            <button onClick={() => changeSubpriority(proyec.id, -1)} disabled={editForm.subpriority <= 1}>↑</button>
                          </div>

                        </td>
                      ) : (
                        <td
                          className={`priority-cell ${proyec.priority === 'alta'
                            ? 'priority-alta'
                            : proyec.priority === 'media'
                              ? 'priority-media'
                              : 'priority-baja'
                            }`}
                          title={proyec.priority}
                        />
                      )}

                      <td>
                        {editingId === proyec.id ? (
                          <input name='proyect' value={editForm.proyect} onChange={handleEditChange} />
                        ) : (proyec.proyect)}
                      </td>
                      <td>
                        {editingId === proyec.id ? (
                          <input type='date' name='dateStart' value={editForm.dateStart} onChange={handleEditChange} />
                        ) : (proyec.dateStart)}
                      </td>
                      <td>
                        {editingId === proyec.id ? (
                          <input type='date' name='dateEnd' value={editForm.dateEnd} onChange={handleEditChange} />
                        ) : (proyec.dateEnd)}
                      </td>
                      <td>
                        {editingId === proyec.id ? (
                          <textarea name='description' value={editForm.description} onChange={handleEditChange} />
                        ) : (proyec.description)}
                      </td>
                      <td>
                        <div className="cell-actions">
                          <label className='checkbox-button'><input type="checkbox" className='checkbox-button' checked={proyec.completed === 1} onChange={() => updateProyectStatus(proyec.id, Number(proyec.completed) === 1 ? 0 : 1)}></input><span className='custom-checkbox'></span></label>

                          <div className="actions-row">
                            {editingId === proyec.id ? ( // {infoUser.rol === "Admin" && (
                              <>
                                <button className="link-btn" onClick={() => handleSaveEdit(proyec.id)}>Guardar</button>
                                <button className="link-btn" onClick={() => setEditingId(null)}>Cancelar</button>
                              </>
                            ) : (
                              <>
                                <button className="link-btn" onClick={() => handleEditClick(proyec)}><Edit size={14} />Editar</button>
                                <button className="link-btn" onClick={() => handleDeleteProyect(proyec.id)}><Trash2 size={14} />Borrar</button>
                              </>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {active === "registro" && (
            <>
              <button onClick={() => setShowForm(true)}><Plus />Añadir registro</button>
              {infoUser.rol === "Admin" && (
                <button onClick={() => setActive("proyectos")}><FileCheck />Ver Proyectos</button>
              )}

              {infoUser.rol === "Admin" && (
                <button onClick={() => setActive("tareas")}><FilePlus />Ver Tareas</button>
              )}

              <input className='main-input' name='username' placeholder='Buscar usuario' value={usernameFilter} onChange={(e) => setUsernameFilter(e.target.value)}></input>
              {showForm && (
                <div className='modal-overlay'>
                  <div className='modal'>
                    <h2>Nuevo Registro de Horas</h2>
                    <form onSubmit={handleSubmit}>
                      <select name='username' placeholder='Usuario' value={formData.username} onChange={handleChange} required>
                        <option value="">Selecciona un usuario</option>
                        {user.map((users) => (
                          <option key={users.id} value={users.username}>{users.username}</option>
                        ))}
                      </select>
                      <select name='proyect' placeholder='Proyecto' value={formData.proyect} onChange={handleChange} required>
                        <option value="">Seleccion un proyecto</option>
                        {proyects.filter((proyec) => Number(proyec.completed) === 0)
                          .map((proyec) => (
                            <option key={proyec.id} value={proyec.proyect}>{proyec.proyect}</option>
                          ))}
                      </select>
                      <select name='task' placeholder='Tarea' value={formData.task} onChange={handleChange} required>
                        <option value="">Selecciona una tarea</option>
                        {task.map((tasks) => (
                          <option key={tasks.id} value={tasks.task}>{tasks.task}</option>
                        ))}
                      </select>
                      <input name='hours' placeholder='Horas' value={formData.hours} onChange={handleChange} required />
                      <textarea name='description' placeholder='Descripcion' value={formData.description} onChange={handleChange} />
                      <button type='submit'>Guardar</button>
                      <button type='button' onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                  </div>
                </div>
              )}
              <table className='table'>
                <thead>
                  <tr>
                    <td>Usuario</td>
                    <td>Proyecto</td>
                    <td>Tarea</td>
                    <td>Horas</td>
                    <td>Descripcion</td>
                  </tr>
                </thead>
                <tbody>
                  {[...filteredHistory].reverse().map((item, index) => (
                    <tr key={index}>
                      <td>{item.user}</td>
                      <td>{item.proyect}</td>
                      <td>{item.task}</td>
                      <td>{item.hours}</td>
                      <td>{item.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {active === "tareas" && (
            <>
              <button onClick={() => setActive("registro")}><ArrowLeft /> Volver</button>
              <button onClick={() => setShowForm(true)}><Plus />Añadir Tarea</button>
              {showForm && (
                <div className='modal-overlay'>
                  <div className='modal'>
                    <h2>Nueva Tarea</h2>
                    <form onSubmit={handleSubmitTask}>
                      <input name="task" placeholder='Tarea' value={formTask.task} onChange={handleChangeTask} required />
                      <button type='submit'>Guardar</button>
                      <button type='button' onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                  </div>
                </div>
              )}
              <table className='table'>
                <thead>
                  <tr>
                    <td>Tarea</td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {task.map((tarea, index) => (
                    <tr key={index}>
                      <td>{tarea.task}</td>
                      <td className='priority-button'><button className='delete' onClick={() => handleDeleteTask(tarea.id)}><Trash2 /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {active === "reportes" && (
            <>
              <button onClick={() => setActive("logs")}><Logs />Ver Logs</button>
              <button onClick={() => setShowForm(true)}><Plus />Añadir reporte</button>
              {showForm && (
                <div className='modal-overlay'>
                  <div className='modal'>
                    <h2>Nuevo Reporte</h2>
                    <form onSubmit={handleSubmitReport}>
                      <input name='company' placeholder='Empresa' value={formReport.company} onChange={handleChangeReport} required />
                      <input name='location' placeholder='Ubicación' value={formReport.location} onChange={handleChangeReport} required />
                      <div className='priority-row'>
                        <span className='priority-label'>Prioridad:</span>
                        <div className='priority-selector'>
                          <div className={`priority-circle red ${formReport.priority === 'alta' ? 'selected' : ''}`} onClick={() => setFormReport({ ...formReport, priority: 'alta' })} title="Alta"></div>
                          <div className={`priority-circle yellow ${formReport.priority === 'media' ? 'selected' : ''}`} onClick={() => setFormReport({ ...formReport, priority: 'media' })} title='Media'></div>
                          <div className={`priority-circle green ${formReport.priority === 'baja' ? 'selected' : ''}`} onClick={() => setFormReport({ ...formReport, priority: 'baja' })} title='Baja'></div>
                        </div>
                      </div>
                      <input type='hidden' name='date' value={formReport.date} />
                      <textarea name='description' placeholder='Descripción' value={formReport.description} onChange={handleChangeReport} />
                      <input type='hidden' name='priority' value={formReport.priority} />
                      <button type='submit'>Guardar</button>
                      <button type='button' onClick={() => setShowForm(false)}>Cancelar</button>
                    </form>
                  </div>
                </div>
              )}
              <table className='table'>
                <thead>
                  <tr>
                    <td></td>
                    <td>Empresa</td>
                    <td>Ubicación</td>
                    <td>Fecha</td>
                    <td>Descripción</td>
                    <td></td>
                    <td></td>
                  </tr>
                </thead>
                <tbody>
                  {[...report].sort((a, b) => {
                    const getPriority = (p) => priorityReport[p.toLowerCase()] ?? 999;
                    return getPriority(a.priority) - getPriority(b.priority);
                  }).map((reports, index) => (
                    <tr key={index}>
                      <td className={`priority-cell ${reports.priority === 'alta' ? 'priority-alta'
                        : reports.priority === 'media' ? 'priority-media' : 'priority-baja'
                        }`} title={reports.priority}></td>
                      <td>{reports.company}</td>
                      <td>{reports.location}</td>
                      <td>{reports.date}</td>
                      <td><button onClick={() => setShowDescription(reports)}><BookOpenText /></button></td>
                      {showDescription && (
                        <div className='modal-overlay'>
                          <div className='modal'>
                            <h2>Descripcion {reports.company}</h2>
                            <textarea readOnly className='modal-textarea' value={showDescription.description} />
                            <button className='modal-cancel' onClick={() => setShowDescription(false)}>Cancelar</button>
                          </div>
                        </div>
                      )}
                      <td className='priority-button'><button onClick={() => setShowInform(true)}><ClipboardList /></button></td>
                      {showInform && (
                        <div className='modal-overlay'>
                          <div className='modal'>
                            <h2>Informes de asistencia</h2>
                            <button onClick={fillPdfControl}><ClipboardPenLine />Informe formacion</button>
                            <button onClick={() => fillPdfParte(reports)}><ClipboardPen />Parte averia</button>
                            <button onClick={() => window.open('/files/acta-recepcion.pdf', '_blank')}><Clipboard />Acta recepcion</button>
                            <button className='modal-cancel' onClick={() => setShowInform(false)}>Cancelar</button>
                          </div>
                        </div>
                      )}
                      <td className='priority-button'><button className='tick' onClick={() => handleCompleteReport(reports.id)}><Check /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {active === "logs" && (
            <>
              <button onClick={() => setActive("reportes")}><ArrowLeft />Volver</button>
              <br></br>
              <table className='table'>
                <thead>
                  <tr>
                    <td>Cliente</td>
                    <td>Ubicación</td>
                    <td>Fecha</td>
                    <td>Descripcion</td>
                  </tr>
                </thead>
                <tbody>
                  {log.map((log, index) => (
                    <tr key={index}>
                      <td>{log.company}</td>
                      <td>{log.location}</td>
                      <td>{log.date}</td>
                      <td><button onClick={() => setShowDescription(log)}><BookOpenText /></button></td>
                      {showDescription && (
                        <div className='modal-overlay'>
                          <div className='modal'>
                            <h2>Descripcion {log.company}</h2>
                            <textarea readOnly className='modal-textarea' value={showDescription.description} />
                            <button className='modal-cancel' onClick={() => setShowDescription(false)}>Cancelar</button>
                          </div>
                        </div>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}

          {active === "cuenta" && (
            <>
              <div className="info-container">
                <h2>Información personal</h2>

                <div className="info-section">
                  <p className="info-label">Nombre</p>
                  {isEditing ? (<input name='username' value={editableUser.username} onChange={handleInputChange} required />) : (<p className='info-value'>{infoUser.username}</p>)}
                </div>

                <div className="info-section">
                  <p className="info-label">Correo</p>
                  {isEditing ? (<input name='gmail' value={editableUser.gmail} onChange={handleInputChange} required />) : (<p className="info-value">{infoUser.gmail}</p>)}
                </div>

                <div className="info-section">
                  <p className="info-label">Contraseña</p>
                  {isEditing ? (<input name='password' value={editableUser.password} onChange={handleInputChange} required />) : (<p className="info-value"></p>)}
                </div>

                <div className="info-section">
                  <p className="info-label">Rol</p>
                  {isEditing ? (<input name='rol' value={editableUser.rol} onChange={handleInputChange} required />) : (<p className="info-value">{infoUser.rol}</p>)}
                </div>

                <div className='info-section'>
                  <button onClick={() => {
                    if (isEditing) {
                      handleSaveUser();
                    } else {
                      setIsEditing(true);
                    }
                  }}>{isEditing ? 'Guardar' : 'Editar'}</button>
                  {isEditing && (
                    <button type='button' onClick={() => setIsEditing(false)}>Cancelar</button>
                  )}
                </div>
              </div>
              {infoUser.rol === "Admin" && (
                <div className='info-container'>
                  <h2>Crear Cuenta</h2>

                  <form onSubmit={handleSubmitUser}>
                    <div className="info-section">
                      <p className="info-label">Nombre</p>
                      <input className='info-value' name='username' value={formUser.username} onChange={handleChangeUser} required></input>
                    </div>

                    <div className="info-section">
                      <p className="info-label">Correo</p>
                      <input className='info-value' name='gmail' value={formUser.gmail} onChange={handleChangeUser} required></input>
                    </div>

                    <div className="info-section">
                      <p className="info-label">Contraseña</p>
                      <input className='info-value' name='password' value={formUser.password} onChange={handleChangeUser} required></input>
                    </div>

                    <div className="info-section">
                      <p className="info-label">Rol</p>
                      <input className='info-value' name='rol' value={formUser.rol} onChange={handleChangeUser} required></input>
                    </div>
                    <div className='info-section'>
                      <button type='submit'>Crear</button>
                      <button type='button' onClick={() => setShowUser(true)}>Ver lista</button>
                    </div>
                  </form>
                </div>
              )}
              {showUser && (
                <div className='modal-overlay'>
                  <div className='modal'>
                    <h2>Usuarios</h2>
                    <table className='table'>
                      <thead>
                        <tr>
                          <th>Nombre</th>
                          <th>Rol</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.map((username, i) => (
                          <tr key={i}>
                            <td>{username.username}</td>
                            <td>{username.rol}</td>
                            <td className='priority-button'><button className='delete' onClick={() => handleDeleteUser(username.id)}><Trash2 /></button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <button className='modal-cancel' onClick={() => setShowUser(false)}>Cerrar</button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AppMain;