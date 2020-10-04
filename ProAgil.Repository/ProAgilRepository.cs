using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProAgil.Domain;

namespace ProAgil.Repository
{
    public class ProAgilRepository : IProAgilRepository
    {
        private readonly ProagilContext _context;
        public ProAgilRepository(ProagilContext context)
        {
            _context = context;
            _context.ChangeTracker.QueryTrackingBehavior = QueryTrackingBehavior.NoTracking;
        }
        //GERAIS
        public void Add<T>(T entity) where T : class
        {
            _context.Add(entity);
        }
        public void Update<T>(T entity) where T : class
        {
            _context.Update(entity);
        }
         public void Delete<T>(T entity) where T : class
        {
            _context.Remove(entity);
        }
        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            _context.RemoveRange(entityArray);
        }
          public async Task<bool> SaveChangesAsync()
        {
            return(await _context.SaveChangesAsync())>0;
        }      

        //EVENTOS   

        public async Task<Evento[]> GetAllEventoAsync(bool includePalestrantes)
        {
            
             IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedesSociais);

            if(includePalestrantes)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderBy(c => c.Id);
            
            return await query.ToArrayAsync();
        }   
        public async Task<Evento[]> GetAllEventoAsyncByTema(string tema, bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedesSociais);

            if(includePalestrantes)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }
            query = query.OrderBy(c => c.Id)
            .Where(c => c.Tema.ToLower().Contains(tema.ToLower()));
            
            return await query.ToArrayAsync();
        }     
        public async Task<Evento> GetEventoAsyncById(int EventoId, bool includePalestrantes)
        {
            IQueryable<Evento> query = _context.Eventos
            .Include(c => c.Lotes)
            .Include(c => c.RedesSociais);

            if(includePalestrantes)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(p => p.Palestrante);
            }
            query = query
            .AsNoTracking()
            .OrderBy(c => c.Id)
            .Where(c => c.Id == EventoId);
            
            return await query.FirstOrDefaultAsync();
        }

        //PALESTRANTES   
        public async Task<Palestrante> GetPalestranteAsync(int PalestraneId, bool includeEventos =false)
        {
             IQueryable<Palestrante> query = _context.Palestrantes            
            .Include(c => c.RedesSociais);

            if(includeEventos)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(e => e.Evento);
            }
            query = query.OrderBy(p => p.Id)
            .Where(p => p.Id == PalestraneId);
            
            return await query.FirstOrDefaultAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesAyncByName(string name, bool includeEventos)
        {
             IQueryable<Palestrante> query = _context.Palestrantes            
            .Include(c => c.RedesSociais);

            if(includeEventos)
            {
                query = query
                .Include(pe => pe.PalestranteEventos)
                .ThenInclude(e => e.Evento);
            }
            query = query.OrderBy(p => p.Id)
            .Where(p => p.Nome.ToLower().Contains(name.ToLower()));
            
            return await query.ToArrayAsync();
        }
    }
}