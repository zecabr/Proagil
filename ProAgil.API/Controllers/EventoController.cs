using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProAgil.API.Dtos;
using ProAgil.Domain;
using ProAgil.Repository;

namespace ProAgil.API.Controllers {
    [Route ("api/[controller]")]
    [ApiController]
    public class EventoController : ControllerBase {
        private readonly IProAgilRepository _repo;
        private readonly IMapper _mapper;
        public EventoController (IProAgilRepository repo, IMapper mapper) {
            _mapper = mapper;
            _repo = repo;
        }

        [HttpGet]
        public async Task<IActionResult> Get () {
            try {
                var eventos = await _repo.GetAllEventoAsync (true);
                var result = _mapper.Map<EventoDTO[]> (eventos);
                return Ok (result);
            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
        }

        [HttpPost ("upload")]
        public async Task<IActionResult> Upload () {
            try {
                var file = Request.Form.Files[0];
                var folderName = Path.Combine ("Resources", "Images");
                var pathToSave = Path.Combine (Directory.GetCurrentDirectory (), folderName);
                if (file.Length > 0) {
                    var filename = ContentDispositionHeaderValue.Parse (file.ContentDisposition).FileName;
                    var fullPath = Path.Combine (pathToSave, filename.Replace ("\"", " ").Trim ());

                    using (var stream = new FileStream (fullPath, FileMode.Create)) {
                        file.CopyTo (stream);
                    }
                }

                return Ok ();
            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
            return BadRequest ("Erro ao tentar upload");
        }

        [HttpGet ("{EventoId}")]
        public async Task<IActionResult> Get (int EventoId) {
            try {
                var evento = await _repo.GetEventoAsyncById (EventoId, true);
                var result = _mapper.Map<EventoDTO> (evento);
                return Ok (result);
            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
        }

        [HttpGet ("getByTema/{tema}")]
        public async Task<IActionResult> Get (string tema) {
            try {
                var result = await _repo.GetAllEventoAsyncByTema (tema, true);
                return Ok (result);
            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
        }

        [HttpPost]
        public async Task<IActionResult> Post (EventoDTO model) {
            try {
                var evento = _mapper.Map<Evento> (model);
                _repo.Add (evento);

                if (await _repo.SaveChangesAsync ())
                    return Created ($"/api/evento/{model.Id}", _mapper.Map<EventoDTO> (model));

            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
            return BadRequest ();
        }

        [HttpPut ("{EventoId}")]
        public async Task<IActionResult> Put (int EventoId, EventoDTO model) {
            try {

                var evento = await _repo.GetEventoAsyncById (EventoId, false);

                if (evento == null)
                    return NotFound ();

                var idLotes = new List<int> ();
                var idRedesSociais = new List<int> ();

                model.Lotes.ForEach (item => idLotes.Add (item.Id));

                model.RedesSociais.ForEach (item => idRedesSociais.Add (item.Id));

                var lotes = evento.Lotes.Where (lote => !idLotes.Contains (lote.Id)).ToArray ();

                var redesSociais = evento.RedesSociais.Where (redeSocial => !idRedesSociais.Contains (redeSocial.Id)).ToArray ();

                if (lotes.Length > 0) _repo.DeleteRange (lotes);

                if (redesSociais.Length > 0) _repo.DeleteRange (redesSociais);

                _mapper.Map (model, evento);

                _repo.Update (evento);

                if (await _repo.SaveChangesAsync ())
                    return Created ($"/api/evento/{evento.Id}", _mapper.Map<EventoDTO> (model));

            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
            return BadRequest ();
        }

        [HttpDelete ("{EventoId}")]
        public async Task<IActionResult> Delete (int EventoId) {
            try {
                var evento = await _repo.GetEventoAsyncById (EventoId, false);

                if (evento == null)
                    return NotFound ();

                _repo.Delete (evento);

                if (await _repo.SaveChangesAsync ())
                    return Ok ();

            } catch (System.Exception) {
                return this.StatusCode (StatusCodes.Status500InternalServerError, "Banco Dados Falhou");
            }
            return BadRequest ();
        }
    }
}