import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/AdminPortalModal.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const oldBlock = `                  <div className="space-y-3">
                    {collections.map((col, idx) => (
                      <div key={col.id} className="bg-[#0F0F0F] border border-gray-800 rounded-xl p-4 flex items-center justify-between">
                        <div>
                          <h4 className="font-serif font-bold text-white text-sm">{col.name}</h4>
                          <p className="text-xs text-gray-400">{col.description || 'Pas de description'}</p>
                          <span className="text-[10px] text-[#D4AF37] font-mono">{col.productIds.length} produit(s) • Ordre : {col.order}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              if (onUpdateCollection && idx > 0) {
                                const updated = [...collections];
                                const temp = updated[idx];
                                updated[idx] = updated[idx - 1];
                                updated[idx - 1] = temp;
                                updated.forEach((c, i) => c.order = i);
                                onUpdateCollection(updated[idx]);
                                onUpdateCollection(updated[idx - 1]);
                              }
                            }}
                            className="p-2 rounded bg-gray-800 text-gray-400 hover:text-white"
                            title="Monter"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (onUpdateCollection && idx < collections.length - 1) {
                                const updated = [...collections];
                                const temp = updated[idx];
                                updated[idx] = updated[idx + 1];
                                updated[idx + 1] = temp;
                                updated.forEach((c, i) => c.order = i);
                                onUpdateCollection(updated[idx]);
                                onUpdateCollection(updated[idx - 1]);
                              }
                            }}
                            className="p-2 rounded bg-gray-800 text-gray-400 hover:text-white"
                            title="Descendre"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(\`Supprimer la collection "{col.name}" ?\`)) {
                                if (onDeleteCollection) onDeleteCollection(col.id);
                              }
                            }}
                            className="p-2 rounded bg-rose-950 text-rose-400 hover:bg-rose-800"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    })}`;

const newBlock = fs.readFileSync(path.join(process.cwd(), 'new_collections_block.txt'), 'utf8');

if (content.includes(oldBlock)) {
  content = content.replace(oldBlock, newBlock);
  fs.writeFileSync(filePath, content);
  console.log('Replaced collections block successfully');
} else {
  console.log('Old block not found');
}
