#!/usr/bin/env python3
"""
Script para simplificar arquivos .obj reduzindo vértices/faces
Requer: pip install pywavefront numpy
"""

import sys
import os

def simplify_obj(input_file, output_file, reduction_percent=70):
    """
    Simplifica um arquivo OBJ removendo vértices duplicados e reduzindo faces
    
    Args:
        input_file: Caminho do arquivo .obj original
        output_file: Caminho do arquivo .obj simplificado
        reduction_percent: Porcentagem de redução (0-100)
    """
    print(f"📥 Lendo {input_file}...")
    
    vertices = []
    faces = []
    normals = []
    texcoords = []
    
    # Ler arquivo
    with open(input_file, 'r') as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith('#'):
                continue
                
            parts = line.split()
            if not parts:
                continue
                
            # Vértices
            if parts[0] == 'v':
                vertices.append([float(x) for x in parts[1:4]])
            # Normais
            elif parts[0] == 'vn':
                normals.append([float(x) for x in parts[1:4]])
            # Coordenadas de textura
            elif parts[0] == 'vt':
                texcoords.append([float(x) for x in parts[1:3]])
            # Faces
            elif parts[0] == 'f':
                face = []
                for v in parts[1:]:
                    # Suportar v, v/vt, v//vn, v/vt/vn
                    indices = v.split('/')
                    face.append(int(indices[0]))
                faces.append(face)
    
    print(f"📊 Original: {len(vertices)} vértices, {len(faces)} faces")
    
    # Simplificação: Manter apenas cada N-ésimo vértice
    # (Método simples - para melhores resultados use Blender)
    keep_ratio = 1 - (reduction_percent / 100)
    step = max(1, int(1 / keep_ratio))
    
    # Remover vértices e faces
    new_vertices = vertices[::step]
    new_faces = []
    
    # Mapear índices antigos para novos
    vertex_map = {i * step: i for i in range(len(new_vertices))}
    
    # Reconstruir faces apenas com vértices que existem
    for face in faces[::step]:
        new_face = []
        valid = True
        for v_idx in face:
            if v_idx - 1 in vertex_map:
                new_face.append(vertex_map[v_idx - 1] + 1)
            else:
                valid = False
                break
        if valid and len(new_face) >= 3:
            new_faces.append(new_face)
    
    print(f"✂️ Simplificado: {len(new_vertices)} vértices, {len(new_faces)} faces")
    print(f"📉 Redução: {((1 - len(new_vertices)/len(vertices)) * 100):.1f}%")
    
    # Escrever arquivo simplificado
    print(f"💾 Salvando em {output_file}...")
    with open(output_file, 'w') as f:
        f.write(f"# Simplified by simplify_obj.py\n")
        f.write(f"# Original: {len(vertices)} vertices, {len(faces)} faces\n")
        f.write(f"# Reduced: {len(new_vertices)} vertices, {len(new_faces)} faces\n\n")
        
        # Escrever vértices
        for v in new_vertices:
            f.write(f"v {v[0]:.6f} {v[1]:.6f} {v[2]:.6f}\n")
        
        # Escrever faces
        for face in new_faces:
            f.write(f"f {' '.join(str(v) for v in face)}\n")
    
    # Comparar tamanhos
    original_size = os.path.getsize(input_file) / (1024 * 1024)
    new_size = os.path.getsize(output_file) / (1024 * 1024)
    
    print(f"\n✅ Concluído!")
    print(f"📦 Tamanho original: {original_size:.2f} MB")
    print(f"📦 Tamanho novo: {new_size:.2f} MB")
    print(f"💾 Economia: {((1 - new_size/original_size) * 100):.1f}%")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("Uso: python simplify_obj.py arquivo.obj [reducao_percent]")
        print("Exemplo: python simplify_obj.py fio_dental.obj 70")
        sys.exit(1)
    
    input_file = sys.argv[1]
    reduction = int(sys.argv[2]) if len(sys.argv) > 2 else 70
    
    # Nome do arquivo de saída
    base, ext = os.path.splitext(input_file)
    output_file = f"{base}_simplified{ext}"
    
    simplify_obj(input_file, output_file, reduction)

